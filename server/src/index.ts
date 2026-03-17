import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import path from 'path';
import type { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import cron from 'node-cron';

// Charge le .env depuis le dossier parent du fichier JS compilé (/opt/mycarecoach/.env)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Client Anthropic
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Client Resend (emails)
const resend = new Resend(process.env.RESEND_API_KEY);

// Client Supabase standard (clé publique) — pour vérifier les tokens des coaches
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Client Supabase admin (clé secrète) — pour les opérations admin
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Helpers emails ──────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  mixte: 'Mixte',
  renforcement: 'Renforcement musculaire',
  cardio: 'Cardio',
  mobilite: 'Mobilité',
  recuperation: 'Récupération',
};

function formatDateFr(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatHeure(heure: string): string {
  return heure.slice(0, 5).replace(':', 'h');
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY manquante — email non envoyé à', to);
    return;
  }
  try {
    await resend.emails.send({
      from: 'MyCareCoach <noreply@mycarecoach.app>',
      to,
      subject,
      html,
    });
    console.log('[email] Envoyé à', to);
  } catch (err: any) {
    console.error('[email] Erreur envoi à', to, ':', err.message);
  }
}

// ─── Middleware d'authentification ───────────────────────────────────────────

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    res.status(401).json({ error: 'Token invalide' });
    return;
  }
  (req as any).user = user;
  next();
}

// ─── App Express ─────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.set('trust proxy', 1);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '100kb' }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
});

app.use(globalLimiter);
app.use('/auth', authLimiter);

// ─── Routes de base ───────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({ message: 'MyCareCoach API is running!' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Route invitation client ──────────────────────────────────────────────────
// Note: Nginx strip /api/ → Express reçoit /invite-client

app.post('/invite-client', authMiddleware, async (req: Request, res: Response) => {
  const { email, prenom, nom, clientId } = req.body;

  if (!email || !clientId) {
    res.status(400).json({ error: 'email et clientId sont requis' });
    return;
  }

  const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { role: 'client', prenom: prenom ?? '', nom: nom ?? '' },
    redirectTo: 'https://mycarecoach.app/client/setup',
  });

  if (inviteError) {
    const alreadyExists =
      inviteError.message.includes('already been registered') ||
      inviteError.message.includes('already registered') ||
      inviteError.message.includes('User already registered');
    if (!alreadyExists) {
      res.status(400).json({ error: inviteError.message });
      return;
    }
  }

  await supabaseAdmin
    .from('clients')
    .update({ invite_sent: true, invite_sent_at: new Date().toISOString() })
    .eq('id', clientId);

  res.json({ success: true });
});

// ─── Route confirmation séance ────────────────────────────────────────────────
// POST /notify-seance — appelée par le frontend juste après la création d'une séance
// Nginx strip /api/ → Express reçoit /notify-seance

app.post('/notify-seance', authMiddleware, async (req: Request, res: Response) => {
  const { seanceId } = req.body;
  if (!seanceId) {
    res.status(400).json({ error: 'seanceId requis' });
    return;
  }

  // Récupère la séance avec les infos du client et du coach
  const { data: seance, error } = await supabaseAdmin
    .from('seances_coach')
    .select('*, clients(prenom, nom, email), coachs(prenom, nom, email)')
    .eq('id', seanceId)
    .single();

  if (error || !seance) {
    res.status(404).json({ error: 'Séance non trouvée' });
    return;
  }

  const client = seance.clients as any;
  const coach = seance.coachs as any;
  const dateFr = formatDateFr(seance.date);
  const heure = formatHeure(seance.heure);
  const type = TYPE_LABELS[seance.type] ?? seance.type;
  const nomCoach = `${coach?.prenom ?? ''} ${coach?.nom ?? ''}`.trim();
  const nomClient = `${client?.prenom ?? ''} ${client?.nom ?? ''}`.trim();

  // Email au client
  if (client?.email) {
    await sendEmail(
      client.email,
      `Séance confirmée — ${dateFr} à ${heure}`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#1A2B4A,#2a4070);padding:32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">MyCareCoach</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Votre séance est confirmée ✅</p>
        </div>
        <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
          <p>Bonjour <strong>${client.prenom}</strong>,</p>
          <p>Votre coach <strong>${nomCoach}</strong> a planifié une séance avec vous :</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            <tr><td style="padding:10px;background:#fff;border:1px solid #e5e7eb;border-radius:8px 8px 0 0">📅 <strong>Date</strong></td><td style="padding:10px;background:#fff;border:1px solid #e5e7eb;text-transform:capitalize">${dateFr}</td></tr>
            <tr><td style="padding:10px;background:#fff;border:1px solid #e5e7eb">🕐 <strong>Heure</strong></td><td style="padding:10px;background:#fff;border:1px solid #e5e7eb">${heure}</td></tr>
            <tr><td style="padding:10px;background:#fff;border:1px solid #e5e7eb">⏱ <strong>Durée</strong></td><td style="padding:10px;background:#fff;border:1px solid #e5e7eb">${seance.duree} minutes</td></tr>
            <tr><td style="padding:10px;background:#fff;border:1px solid #e5e7eb">🏋️ <strong>Type</strong></td><td style="padding:10px;background:#fff;border:1px solid #e5e7eb">${type}</td></tr>
            ${seance.notes ? `<tr><td style="padding:10px;background:#fff;border:1px solid #e5e7eb;border-radius:0 0 8px 8px">📝 <strong>Notes</strong></td><td style="padding:10px;background:#fff;border:1px solid #e5e7eb;border-radius:0 0 8px 8px">${seance.notes}</td></tr>` : ''}
          </table>
          <div style="text-align:center;margin-top:24px">
            <a href="https://mycarecoach.app/client" style="background:linear-gradient(135deg,#00C896,#00a87e);color:white;padding:14px 32px;border-radius:9999px;text-decoration:none;font-weight:600;display:inline-block">Voir mon espace client</a>
          </div>
          <p style="margin-top:24px;color:#6b7280;font-size:14px">À bientôt !</p>
        </div>
      </div>`,
    );
  }

  // Email au coach
  if (coach?.email) {
    await sendEmail(
      coach.email,
      `Séance planifiée — ${nomClient} — ${dateFr}`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:linear-gradient(135deg,#1A2B4A,#2a4070);padding:24px;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">MyCareCoach</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
          <p>Séance créée avec succès pour <strong>${nomClient}</strong> :</p>
          <p style="background:#fff;border:1px solid #e5e7eb;padding:16px;border-radius:8px">
            📅 <strong style="text-transform:capitalize">${dateFr}</strong> à ${heure} — ${seance.duree} min — ${type}
          </p>
        </div>
      </div>`,
    );
  }

  res.json({ success: true });
});

// ─── Route Chatbot IA ─────────────────────────────────────────────────────────
// POST /chat-coach — Note: Nginx strip /api/ → Express reçoit /chat-coach

const SYSTEM_PROMPT = `Tu es MyCareCoach AI, un assistant expert en coaching santé et sport.
Tu aides les coachs professionnels à concevoir des programmes sportifs individualisés, sécurisés et efficaces pour leurs clients.

Tu bases tes recommandations sur :
- Les recommandations officielles de l'OMS sur l'activité physique et la santé (150-300 min/semaine cardio modéré, 2 séances muscu/semaine minimum, etc.)
- Les principes de périodisation sportive
- L'adaptation aux pathologies et contre-indications courantes
- La progression graduelle et la récupération

Pour chaque client, tu tiens compte de :
- Son niveau (débutant/intermédiaire/avancé)
- Ses objectifs (perte de poids, prise de masse, endurance, santé générale)
- Ses éventuelles limitations physiques ou médicales
- Sa disponibilité hebdomadaire

Tu réponds en français, de façon claire et structurée.
Tu proposes des programmes concrets avec exercices, séries, répétitions, durées.
Tu rappelles toujours les précautions de sécurité importantes.
Tu ne remplace pas un avis médical et le précises si nécessaire.`;

const QUOTA_MENSUEL = 100;

app.post('/chat-coach', authMiddleware, async (req: Request, res: Response) => {
  const coachId = (req as any).user.id;
  const { messages, clientId } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages est requis (tableau non vide)' });
    return;
  }

  const mois = new Date().toISOString().slice(0, 7);

  const { data: usageData, error: usageError } = await supabaseAdmin
    .from('chat_usage')
    .select('id, messages_count, tokens_total')
    .eq('coach_id', coachId)
    .eq('mois', mois)
    .maybeSingle();

  if (usageError) {
    console.error('[chat-coach] Erreur lecture chat_usage:', usageError.message);
    res.status(500).json({ error: 'Erreur serveur' });
    return;
  }

  const currentCount = usageData?.messages_count ?? 0;
  const currentTokens = usageData?.tokens_total ?? 0;

  if (currentCount >= QUOTA_MENSUEL) {
    res.status(429).json({
      error: 'QUOTA_ATTEINT',
      message: 'Vous avez atteint votre limite de 100 messages ce mois-ci.',
      usage: { messages_count: currentCount, limit: QUOTA_MENSUEL, remaining: 0 },
    });
    return;
  }

  let contextClient = '';
  if (clientId) {
    const { data: clientData } = await supabaseAdmin
      .from('clients')
      .select('prenom, nom, date_naissance, objectif, telephone')
      .eq('id', clientId)
      .maybeSingle();
    if (clientData) {
      contextClient = `\n\nContexte du client sélectionné :\n- Nom : ${clientData.prenom ?? ''} ${clientData.nom ?? ''}\n- Objectif : ${clientData.objectif ?? 'non renseigné'}\n- Téléphone : ${clientData.telephone ?? 'non renseigné'}`;
    }
  }

  const systemWithContext = contextClient ? SYSTEM_PROMPT + contextClient : SYSTEM_PROMPT;

  let anthropicReply = '';
  let tokensUsed = 0;
  try {
    const completion = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemWithContext,
      messages: messages as Anthropic.MessageParam[],
    });
    const firstBlock = completion.content[0];
    anthropicReply = firstBlock.type === 'text' ? firstBlock.text : '';
    tokensUsed = completion.usage.input_tokens + completion.usage.output_tokens;
  } catch (err: any) {
    console.error('[chat-coach] Erreur Anthropic:', err.message);
    res.status(502).json({ error: 'Erreur lors de la génération de la réponse IA.' });
    return;
  }

  const newCount = currentCount + 1;
  const newTokens = currentTokens + tokensUsed;
  await supabaseAdmin
    .from('chat_usage')
    .upsert(
      { coach_id: coachId, mois, messages_count: newCount, tokens_total: newTokens, updated_at: new Date().toISOString() },
      { onConflict: 'coach_id,mois' }
    );

  res.json({
    reply: anthropicReply,
    usage: { messages_count: newCount, limit: QUOTA_MENSUEL, remaining: QUOTA_MENSUEL - newCount },
  });
});

// ─── Route programme client ──────────────────────────────────────────────────
// GET /client/programme — Nginx strip /api/ → Express reçoit /client/programme

app.get('/client/programme', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { data: client, error: clientError } = await supabaseAdmin
    .from('clients')
    .select('id, coach_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (clientError || !client) {
    res.status(404).json({ error: 'Client non trouvé' });
    return;
  }

  // Récupère le programme le plus récent pour ce client
  const { data: programme, error: progError } = await supabaseAdmin
    .from('programmes')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (progError) {
    console.error('[client/programme] Erreur Supabase:', progError.message);
    res.status(500).json({ error: 'Erreur serveur' });
    return;
  }

  if (!programme) {
    console.log('[client/programme] Aucun programme trouvé pour client_id:', client.id);
    res.json({ programme: null });
    return;
  }

  console.log('[client/programme] Programme trouvé:', programme.id, programme.titre);

  res.json({
    programme: {
      id: programme.id,
      nom: programme.titre,           // titre → nom (compat interface ProgrammeClient)
      description: programme.contenu, // contenu → description
      duree_semaines: programme.duree_semaines,
      statut: programme.statut,
      exercices: [],
      created_at: programme.created_at,
    },
  });
});

// ─── Route profil client ─────────────────────────────────────────────────────
// GET /client/profil — Nginx strip /api/ → Express reçoit /client/profil

app.get('/client/profil', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { data: client, error } = await supabaseAdmin
    .from('clients')
    .select('id, prenom, nom, email, telephone, date_naissance, objectifs, coach_id, taille')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !client) {
    console.error('[client/profil] Client non trouvé pour user_id:', user.id);
    res.status(404).json({ error: 'Client non trouvé' });
    return;
  }

  console.log('[client/profil] Profil retourné pour:', client.email);
  res.json({ client });
});

// PATCH /client/profil — met à jour les champs autorisés (ex: taille)
app.patch('/client/profil', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { taille } = req.body;

  const { data: client } = await supabaseAdmin
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!client) {
    res.status(404).json({ error: 'Client non trouvé' });
    return;
  }

  const updates: Record<string, any> = {};
  if (taille != null && !isNaN(parseFloat(taille))) updates.taille = parseFloat(taille);

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: 'Aucun champ à mettre à jour' });
    return;
  }

  const { error } = await supabaseAdmin
    .from('clients')
    .update(updates)
    .eq('id', client.id);

  if (error) {
    console.error('[PATCH client/profil]', error.message);
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ ok: true });
});

// ─── Routes métriques client ──────────────────────────────────────────────────
// GET /client/metriques — 10 dernières métriques du client connecté

app.get('/client/metriques', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { data: client } = await supabaseAdmin
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!client) {
    res.status(404).json({ error: 'Client non trouvé' });
    return;
  }

  const { data: metriques, error } = await supabaseAdmin
    .from('metriques')
    .select('*')
    .eq('client_id', client.id)
    .order('date', { ascending: false })
    .limit(10);

  if (error) {
    console.error('[client/metriques GET]', error.message);
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ metriques: metriques || [] });
});

// POST /client/metriques — enregistre une nouvelle métrique

app.post('/client/metriques', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  console.log('[POST metriques] Body reçu:', req.body);

  const { poids, tour_de_taille, tour_de_hanches, energie, sommeil, note, date } = req.body;

  const { data: client } = await supabaseAdmin
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  console.log('[POST metriques] Client trouvé:', client);

  if (!client) {
    res.status(404).json({ error: 'Client non trouvé' });
    return;
  }

  const payload: Record<string, any> = {
    client_id: client.id,
    date: date || new Date().toISOString().split('T')[0],
  };

  if (poids != null && poids !== '')           payload.poids           = parseFloat(poids);
  if (tour_de_taille != null && tour_de_taille !== '') payload.tour_de_taille  = parseFloat(tour_de_taille);
  if (tour_de_hanches != null && tour_de_hanches !== '') payload.tour_de_hanches = parseFloat(tour_de_hanches);
  if (energie != null && energie !== '')       payload.energie         = parseFloat(energie);
  if (sommeil != null && sommeil !== '')       payload.sommeil         = parseFloat(sommeil);
  if (note)                                    payload.note            = note;

  console.log('[POST metriques] Payload insert:', payload);

  const { data, error } = await supabaseAdmin
    .from('metriques')
    .insert(payload)
    .select()
    .single();

  console.log('[POST metriques] Insert result — data:', data, '| error:', error);

  if (error) {
    console.error('[client/metriques POST]', error.message);
    res.status(500).json({ error: error.message });
    return;
  }

  console.log('[client/metriques POST] Enregistré pour client:', client.id);
  res.json({ metrique: data });
});

// ─── Cron job : rappels 24h avant la séance ───────────────────────────────────
// Tourne tous les jours à 8h00 (heure serveur)

async function sendDailyReminders(): Promise<void> {
  const demain = new Date();
  demain.setDate(demain.getDate() + 1);
  const demainStr = demain.toISOString().split('T')[0];
  console.log(`[cron] Envoi rappels pour le ${demainStr}`);

  const { data: seances, error } = await supabaseAdmin
    .from('seances_coach')
    .select('*, clients(prenom, nom, email), coachs(prenom, nom, email)')
    .eq('date', demainStr)
    .eq('fait', false);

  if (error) {
    console.error('[cron] Erreur Supabase:', error.message);
    return;
  }

  const liste = seances || [];
  console.log(`[cron] ${liste.length} séance(s) demain`);

  for (const seance of liste) {
    const client = (seance as any).clients;
    const coach = (seance as any).coachs;
    const dateFr = formatDateFr(seance.date);
    const heure = formatHeure(seance.heure);
    const type = TYPE_LABELS[seance.type] ?? seance.type;
    const nomCoach = `${coach?.prenom ?? ''} ${coach?.nom ?? ''}`.trim();
    const nomClient = `${client?.prenom ?? ''} ${client?.nom ?? ''}`.trim();

    // Rappel client
    if (client?.email) {
      await sendEmail(
        client.email,
        `Rappel — Séance demain à ${heure} 💪`,
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
          <div style="background:linear-gradient(135deg,#00C896,#00a87e);padding:32px;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">MyCareCoach</h1>
            <p style="color:rgba(255,255,255,0.9);margin:8px 0 0">Rappel séance 💪</p>
          </div>
          <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
            <p>Bonjour <strong>${client.prenom}</strong>,</p>
            <p>Rappel : vous avez une séance <strong>demain</strong> !</p>
            <table style="width:100%;border-collapse:collapse;margin:24px 0">
              <tr><td style="padding:10px;background:#fff;border:1px solid #e5e7eb;border-radius:8px 8px 0 0">📅 <strong>Demain</strong></td><td style="padding:10px;background:#fff;border:1px solid #e5e7eb;text-transform:capitalize">${dateFr} à ${heure}</td></tr>
              <tr><td style="padding:10px;background:#fff;border:1px solid #e5e7eb">⏱ <strong>Durée</strong></td><td style="padding:10px;background:#fff;border:1px solid #e5e7eb">${seance.duree} minutes</td></tr>
              <tr><td style="padding:10px;background:#fff;border:1px solid #e5e7eb">🏋️ <strong>Type</strong></td><td style="padding:10px;background:#fff;border:1px solid #e5e7eb">${type}</td></tr>
              <tr><td style="padding:10px;background:#fff;border:1px solid #e5e7eb;border-radius:0 0 8px 8px">👤 <strong>Coach</strong></td><td style="padding:10px;background:#fff;border:1px solid #e5e7eb;border-radius:0 0 8px 8px">${nomCoach}</td></tr>
            </table>
            <div style="text-align:center;margin-top:24px">
              <a href="https://mycarecoach.app/client" style="background:linear-gradient(135deg,#00C896,#00a87e);color:white;padding:14px 32px;border-radius:9999px;text-decoration:none;font-weight:600;display:inline-block">Voir mon programme</a>
            </div>
            <p style="margin-top:24px;color:#6b7280;font-size:14px">Bonne séance ! 💪</p>
          </div>
        </div>`,
      );
    }

    // Rappel coach
    if (coach?.email) {
      await sendEmail(
        coach.email,
        `Rappel séance — ${nomClient} — demain ${heure}`,
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
          <div style="background:linear-gradient(135deg,#1A2B4A,#2a4070);padding:24px;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">MyCareCoach</h1>
          </div>
          <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
            <p>Rappel : séance avec <strong>${nomClient}</strong> demain à <strong>${heure}</strong>.</p>
            <p style="background:#fff;border:1px solid #e5e7eb;padding:16px;border-radius:8px;color:#374151">
              📅 <strong style="text-transform:capitalize">${dateFr}</strong> — ${seance.duree} min — ${type}
            </p>
          </div>
        </div>`,
      );
    }
  }
  console.log(`[cron] Rappels envoyés`);
}

// Tous les jours à 8h00
cron.schedule('0 8 * * *', () => {
  sendDailyReminders().catch(err => console.error('[cron] Erreur:', err));
});

console.log('[cron] Rappels quotidiens programmés à 8h00');

// ─── Error handler ────────────────────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  } else {
    console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
