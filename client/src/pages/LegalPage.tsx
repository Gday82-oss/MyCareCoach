import { Link } from 'react-router-dom';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';

export type LegalType = 'cgu' | 'confidentialite' | 'mentions-legales' | 'cookies';

// ─────────────────────────────────────────────────────────
// Micro-composants de mise en forme
// ─────────────────────────────────────────────────────────

function LegalH1({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{ color: '#1A2B4A', fontSize: '26px', fontWeight: 800, lineHeight: 1.3 }} className="mb-2">
      {children}
    </h1>
  );
}

function UpdateDate({ date }: { date: string }) {
  return (
    <p className="text-sm text-gray-400 mb-8 pb-6" style={{ borderBottom: '1px solid #E5E7EB' }}>
      Dernière mise à jour : {date}
    </p>
  );
}

function Article({ number, title, children }: { number?: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 style={{ color: '#1A2B4A', fontSize: '17px', fontWeight: 700, marginBottom: '10px', paddingBottom: '8px', borderBottom: '2px solid #00C896' }}>
        {number !== undefined && (
          <span style={{ color: '#00C896' }}>Article {number} — </span>
        )}
        {title}
      </h2>
      <div style={{ color: '#444444', fontSize: '15px', lineHeight: 1.75 }} className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function Ul({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="space-y-1.5 ml-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span style={{ color: '#00C896', fontWeight: 700, flexShrink: 0, marginTop: '3px', fontSize: '13px' }}>●</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Mail() {
  return (
    <a href="mailto:contact@mycarecoach.app" style={{ color: '#00C896' }} className="underline font-medium">
      contact@mycarecoach.app
    </a>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#00C896' }} className="underline">
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────────────────
// CGU
// ─────────────────────────────────────────────────────────

function CGU() {
  return (
    <>
      <LegalH1>Conditions Générales d'Utilisation</LegalH1>
      <UpdateDate date="15 mars 2025" />

      <Article number={1} title="Présentation de MyCareCoach">
        <p>
          MyCareCoach est une plateforme numérique éditée par <strong>Guillaume Dayan</strong>, entrepreneur individuel.
          Contact : <Mail />. Le service est accessible à l'adresse <strong>mycarecoach.app</strong>.
        </p>
        <p>
          Il s'adresse aux coachs sportifs professionnels et à leurs clients dans le cadre d'un suivi
          sport-santé sur ordonnance, pouvant être remboursé par les mutuelles.
        </p>
      </Article>

      <Article number={2} title="Acceptation des CGU">
        <p>
          L'utilisation de MyCareCoach implique l'acceptation pleine et entière des présentes CGU.
          Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser le service.
        </p>
        <p>
          MyCareCoach se réserve le droit de modifier les CGU à tout moment. Les utilisateurs seront
          informés des changements significatifs par email avec un préavis de 30 jours.
        </p>
      </Article>

      <Article number={3} title="Description des services">
        <p>MyCareCoach propose deux interfaces complémentaires :</p>
        <Ul items={[
          "Interface Coach (web) : dashboard temps réel, gestion des clients, planification des séances, programmes d'entraînement, métriques, facturation, attestations mutuelle, chatbot IA.",
          "Interface Client (PWA mobile) : consultation des séances, programmes personnalisés, suivi des métriques, profil client.",
        ]} />
        <p>Les fonctionnalités disponibles dépendent du plan souscrit (voir Article 5).</p>
      </Article>

      <Article number={4} title="Accès et création de compte">
        <p>L'accès à MyCareCoach requiert la création d'un compte avec une adresse email valide. L'utilisateur s'engage à :</p>
        <Ul items={[
          "Fournir des informations exactes et complètes lors de l'inscription.",
          "Maintenir la confidentialité de ses identifiants de connexion.",
          "Notifier immédiatement MyCareCoach en cas d'utilisation non autorisée de son compte.",
          "Ne pas partager son accès avec des tiers non autorisés.",
        ]} />
        <p>L'inscription est réservée aux personnes majeures (18 ans ou plus) ou aux professionnels du sport-santé dûment habilités.</p>
      </Article>

      <Article number={5} title="Plans et tarification">
        <p>MyCareCoach propose trois formules d'abonnement :</p>
        <div className="rounded-xl overflow-hidden border border-gray-200 my-4">
          {[
            {
              plan: 'Gratuit', price: '0 €', desc: 'Pour démarrer sans risque.',
              features: ['3 clients maximum', 'Dashboard & calendrier', 'Programmes de base', 'Support par email'],
            },
            {
              plan: 'Pro', price: '19 €/mois', desc: 'Pour les coachs qui veulent scaler.',
              features: ['Clients illimités', 'Dashboard & métriques avancées', 'Facturation & attestations mutuelle', 'Rappels automatiques', 'Export PDF', 'Générateur de programmes IA (50 req/mois)', 'Support prioritaire'],
            },
            {
              plan: 'Business', price: '49 €/mois', desc: 'Pour les structures multi-coachs.',
              features: ['Tout le plan Pro inclus', 'Multi-coachs & dashboard direction', 'Gestion des permissions', 'Intégrations avancées', 'IA illimitée (coach + client)', 'Support dédié 24/7'],
            },
          ].map(({ plan, price, desc, features }) => (
            <div key={plan} className="p-5 border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <strong style={{ color: '#1A2B4A', fontSize: '16px' }}>{plan}</strong>
                <span style={{ color: '#00C896', fontWeight: 700, fontSize: '15px' }}>{price}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{desc}</p>
              <Ul items={features} />
            </div>
          ))}
        </div>
        <p>
          Les tarifs sont affichés hors taxes. Le paiement est mensuel, sans engagement.
          L'abonnement peut être modifié ou résilié à tout moment (voir Article 10).
        </p>
      </Article>

      <Article number={6} title="Obligations des utilisateurs">
        <p>Les utilisateurs s'engagent à utiliser MyCareCoach de manière conforme à la loi et aux présentes CGU. Il est notamment interdit de :</p>
        <Ul items={[
          "Utiliser le service à des fins illicites ou contraires à l'ordre public.",
          "Tenter d'accéder aux données d'autres utilisateurs sans autorisation.",
          "Perturber ou compromettre l'infrastructure technique de la plateforme.",
          "Reproduire, revendre ou exploiter commercialement le service sans autorisation écrite.",
          "Publier des contenus diffamatoires, offensants ou portant atteinte aux droits de tiers.",
          "Utiliser des robots, scrapers ou outils automatisés non autorisés.",
        ]} />
        <p>Tout manquement grave peut entraîner la suspension ou la suppression du compte sans préavis ni remboursement.</p>
      </Article>

      <Article number={7} title="Données personnelles et RGPD">
        <p>
          MyCareCoach traite les données personnelles conformément au RGPD (UE 2016/679) et à la loi Informatique
          et Libertés. Le détail est disponible dans notre{' '}
          <Link to="/confidentialite" style={{ color: '#00C896' }} className="underline">Politique de Confidentialité</Link>,
          qui fait partie intégrante des présentes CGU.
        </p>
        <p>
          En utilisant MyCareCoach, vous consentez explicitement au traitement de vos données selon
          les conditions décrites dans cette politique, y compris le traitement de données de santé.
        </p>
      </Article>

      <Article number={8} title="Propriété intellectuelle">
        <p>
          L'ensemble des éléments de MyCareCoach — interface, code source, logos, marques, textes,
          graphismes, fonctionnalités — est la propriété exclusive de Guillaume Dayan et est protégé
          par le droit de la propriété intellectuelle français et international.
        </p>
        <p>
          Toute reproduction, modification ou exploitation sans autorisation écrite préalable est interdite.
          Les données saisies par les utilisateurs (fiches clients, programmes, métriques) restent leur propriété.
          MyCareCoach dispose d'une licence d'utilisation limitée à la fourniture du service.
        </p>
      </Article>

      <Article number={9} title="Responsabilité et garanties">
        <p>MyCareCoach est fourni "en l'état". MyCareCoach ne peut être tenu responsable :</p>
        <Ul items={[
          "Des interruptions temporaires pour maintenance ou cas de force majeure.",
          "Des pertes de données liées à des défaillances techniques imprévues.",
          "Des décisions médicales ou sportives prises sur la base des informations affichées.",
          "Des contenus générés par les utilisateurs.",
        ]} />
        <p>
          <strong>Clause spécifique IA :</strong> Les suggestions générées par l'assistant IA (programmes,
          chatbot) sont fournies à titre indicatif uniquement. Elles ne constituent pas un avis médical
          et ne remplacent pas le jugement professionnel du coach. MyCareCoach décline toute responsabilité
          quant à l'utilisation de ces suggestions.
        </p>
      </Article>

      <Article number={10} title="Résiliation">
        <p>L'utilisateur peut résilier son compte à tout moment depuis les paramètres ou en contactant <Mail />.</p>
        <p>En cas de résiliation :</p>
        <Ul items={[
          "L'accès aux fonctionnalités payantes cesse à la fin de la période facturée en cours.",
          "Les données sont conservées 30 jours puis définitivement supprimées.",
          "Les factures émises restent accessibles conformément aux obligations légales (10 ans).",
          "Aucun remboursement n'est effectué pour la période en cours, sauf disposition légale contraire.",
        ]} />
      </Article>

      <Article number={11} title="Droit applicable">
        <p>
          Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'engagent
          à rechercher une solution amiable avant tout recours judiciaire. À défaut d'accord amiable,
          les tribunaux français compétents seront seuls compétents.
        </p>
        <p>
          Conformément au Code de la consommation, les utilisateurs disposent du droit de recourir
          à un médiateur de la consommation en vue de la résolution amiable de tout litige.
        </p>
      </Article>

      <Article number={12} title="Contact">
        <Ul items={[
          <>Email : <Mail /></>,
          "Site : mycarecoach.app",
          "Éditeur : Guillaume Dayan",
        ]} />
      </Article>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Politique de Confidentialité
// ─────────────────────────────────────────────────────────

function Confidentialite() {
  return (
    <>
      <LegalH1>Politique de Confidentialité</LegalH1>
      <UpdateDate date="15 mars 2025" />

      <Article number={1} title="Responsable du traitement">
        <p>Le responsable du traitement des données personnelles collectées via MyCareCoach est :</p>
        <Ul items={[
          "Nom : Guillaume Dayan",
          "Qualité : Entrepreneur individuel",
          <>Contact : <Mail /></>,
          "Site : mycarecoach.app",
        ]} />
        <p>Guillaume Dayan s'engage à respecter le RGPD (UE 2016/679) et la loi Informatique et Libertés.</p>
      </Article>

      <Article number={2} title="Données collectées">
        <p><strong style={{ color: '#1A2B4A' }}>Pour les coachs :</strong></p>
        <Ul items={[
          "Identité : nom, prénom",
          "Contact : adresse email, numéro de téléphone",
          "Professionnel : numéro SIRET, adresse professionnelle",
          "Compte : mot de passe chiffré (bcrypt), historique de connexion",
        ]} />
        <p><strong style={{ color: '#1A2B4A' }}>Pour les clients :</strong></p>
        <Ul items={[
          "Identité : nom, prénom",
          "Contact : adresse email, numéro de téléphone",
          "Personnel : date de naissance",
          "Santé : métriques (poids, fréquence cardiaque, tension artérielle, VO₂max), notes de séances, objectifs sportifs — traitement spécifique décrit à l'Article 9",
        ]} />
        <p>
          <strong style={{ color: '#1A2B4A' }}>Données de navigation :</strong> journaux d'accès techniques
          (adresse IP, navigateur, pages visitées) à des fins de sécurité et de diagnostic uniquement.
        </p>
      </Article>

      <Article number={3} title="Finalités et bases légales">
        <div className="space-y-2">
          {[
            { finalite: "Fourniture du service", base: "Exécution du contrat (art. 6.1.b RGPD)" },
            { finalite: "Facturation et comptabilité", base: "Obligation légale (art. 6.1.c RGPD)" },
            { finalite: "Sécurité et prévention des fraudes", base: "Intérêt légitime (art. 6.1.f RGPD)" },
            { finalite: "Amélioration du service", base: "Intérêt légitime (art. 6.1.f RGPD)" },
            { finalite: "Fonctionnalités IA (génération de programmes, chatbot)", base: "Consentement (art. 6.1.a RGPD)" },
            { finalite: "Données de santé (métriques, suivi sportif)", base: "Consentement explicite (art. 9.2.a RGPD)" },
          ].map(({ finalite, base }) => (
            <div key={finalite} className="flex gap-3 p-3 rounded-xl" style={{ background: '#F8FFFE', border: '1px solid rgba(0,200,150,0.15)' }}>
              <div>
                <p style={{ color: '#1A2B4A', fontWeight: 600, fontSize: '14px' }}>{finalite}</p>
                <p style={{ color: '#888', fontSize: '13px' }}>{base}</p>
              </div>
            </div>
          ))}
        </div>
      </Article>

      <Article number={4} title="Hébergement et sous-traitants">
        <p>MyCareCoach utilise les prestataires techniques suivants, avec lesquels des contrats de traitement de données ont été conclus :</p>
        <Ul items={[
          "Supabase Inc. (base de données, authentification) — infrastructure AWS, région EU Ireland (Dublin). Données chiffrées au repos (AES-256) et en transit (TLS).",
          "Resend (envoi d'emails transactionnels) — conformité RGPD, serveurs EU.",
          "Anthropic PBC (intelligence artificielle) — les données envoyées à l'IA sont minimisées. Aucune donnée de santé brute n'est transmise.",
          "Hostinger International Ltd (hébergement VPS) — serveurs EU.",
        ]} />
        <p>Aucune donnée n'est vendue ou cédée à des tiers à des fins commerciales.</p>
      </Article>

      <Article number={5} title="Durée de conservation">
        <Ul items={[
          "Données de compte actif : conservées pendant toute la durée du contrat.",
          "Après résiliation du compte : suppression définitive au bout de 30 jours.",
          "Données de facturation : conservées 10 ans conformément aux obligations légales comptables.",
          "Journaux d'accès techniques : conservés 12 mois maximum.",
        ]} />
      </Article>

      <Article number={6} title="Droits des utilisateurs">
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <Ul items={[
          "Droit d'accès : obtenir une copie de vos données.",
          "Droit de rectification : corriger des données inexactes.",
          "Droit à l'effacement (« droit à l'oubli ») : demander la suppression de vos données.",
          "Droit à la portabilité : recevoir vos données dans un format structuré et lisible.",
          "Droit d'opposition : vous opposer à certains traitements.",
          "Droit de retrait du consentement : à tout moment pour les traitements basés sur le consentement.",
        ]} />
        <p>
          Pour exercer ces droits : <Mail />. Réponse sous 30 jours maximum.
        </p>
        <p>
          Vous disposez également du droit d'introduire une réclamation auprès de la <strong>CNIL</strong> :{' '}
          <ExternalLink href="https://www.cnil.fr">www.cnil.fr</ExternalLink>
        </p>
      </Article>

      <Article number={7} title="Sécurité">
        <p>MyCareCoach met en œuvre les mesures techniques suivantes pour protéger vos données :</p>
        <Ul items={[
          "Chiffrement HTTPS (TLS 1.3) pour toutes les communications.",
          "Chiffrement des données au repos via Supabase (AES-256).",
          "Row-Level Security (RLS) Supabase : chaque utilisateur n'accède qu'à ses propres données.",
          "Mots de passe hachés (bcrypt) — jamais stockés en clair.",
          "Sauvegardes quotidiennes chiffrées.",
          "Accès administrateur limité aux seuls besoins techniques.",
        ]} />
        <p>
          En cas de violation de données susceptible d'engendrer un risque élevé, vous serez notifié
          dans les 72 heures conformément à l'article 34 du RGPD.
        </p>
      </Article>

      <Article number={8} title="Cookies">
        <p>
          MyCareCoach utilise des cookies essentiels au fonctionnement du service (authentification)
          et des cookies de préférences (thème, langue). Pour le détail complet, consultez notre{' '}
          <Link to="/cookies" style={{ color: '#00C896' }} className="underline">Politique de Cookies</Link>.
        </p>
      </Article>

      <Article number={9} title="Données de santé">
        <p>
          Les métriques collectées (poids, fréquence cardiaque, tension artérielle, etc.) constituent
          des <strong>données de santé</strong> au sens de l'article 9 du RGPD, soumises à une protection
          renforcée.
        </p>
        <p>
          Leur traitement repose sur le <strong>consentement explicite</strong> du client, recueilli lors
          de la création du compte. Ce consentement peut être retiré à tout moment sans remettre en cause
          la licéité du traitement antérieur.
        </p>
        <Ul items={[
          "Ces données sont chiffrées au repos et en transit.",
          "Elles sont accessibles uniquement au client et au coach désigné.",
          "Elles ne sont jamais transmises à des tiers sans consentement.",
          "Elles ne sont jamais utilisées pour alimenter des modèles d'IA sans anonymisation préalable.",
        ]} />
      </Article>

      <Article number={10} title="Modifications de la politique">
        <p>
          Toute modification significative sera notifiée par email avec un préavis de 30 jours.
          La date de dernière mise à jour est indiquée en haut de ce document.
        </p>
      </Article>

      <Article number={11} title="Contact et réclamations">
        <Ul items={[
          <>Email : <Mail /></>,
          "Délai de réponse : 30 jours maximum",
        ]} />
        <p>Autorité de contrôle française :</p>
        <p>
          <strong>CNIL</strong> — 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07<br />
          <ExternalLink href="https://www.cnil.fr">www.cnil.fr</ExternalLink>
        </p>
      </Article>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Mentions Légales
// ─────────────────────────────────────────────────────────

function MentionsLegales() {
  return (
    <>
      <LegalH1>Mentions Légales</LegalH1>
      <UpdateDate date="15 mars 2025" />

      <Article number={1} title="Éditeur du site">
        <p>Le site <strong>mycarecoach.app</strong> est édité par :</p>
        <Ul items={[
          "Nom : Guillaume Dayan",
          "Statut : Entrepreneur individuel",
          <>Email : <Mail /></>,
          "Site web : mycarecoach.app",
        ]} />
      </Article>

      <Article number={2} title="Hébergement">
        <p><strong style={{ color: '#1A2B4A' }}>Serveur applicatif (VPS) :</strong></p>
        <Ul items={[
          "Hébergeur : Hostinger International Ltd",
          "Adresse : 61 Lordou Vironos Street, 6023 Larnaca, Chypre",
          <ExternalLink href="https://www.hostinger.fr">www.hostinger.fr</ExternalLink>,
        ]} />
        <p><strong style={{ color: '#1A2B4A' }}>Base de données et authentification :</strong></p>
        <Ul items={[
          "Prestataire : Supabase Inc.",
          "Infrastructure : Amazon Web Services (AWS), région EU Ireland (Dublin)",
          "Données hébergées au sein de l'Union Européenne",
        ]} />
      </Article>

      <Article number={3} title="Propriété intellectuelle">
        <p>
          L'ensemble du contenu de ce site — textes, images, logos, graphismes, code source,
          fonctionnalités — est protégé par le droit de la propriété intellectuelle et est la
          propriété exclusive de Guillaume Dayan, sauf mention contraire.
        </p>
        <p>
          La marque "MyCareCoach" et le logo associé sont des éléments distinctifs protégés.
          Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
        </p>
        <p>
          Les utilisateurs conservent la propriété de leurs données personnelles et des contenus
          qu'ils créent sur la plateforme (programmes, notes, fiches clients).
        </p>
      </Article>

      <Article number={4} title="Limitation de responsabilité">
        <p>MyCareCoach s'efforce d'assurer l'exactitude des informations diffusées sur le site. Il ne saurait être tenu responsable :</p>
        <Ul items={[
          "Des dommages directs ou indirects résultant de l'utilisation du service.",
          "Des interruptions ou indisponibilités temporaires du service.",
          "Des contenus générés par les utilisateurs ou par l'intelligence artificielle intégrée.",
          "Des décisions prises sur la base des informations ou suggestions affichées.",
        ]} />
      </Article>

      <Article number={5} title="Droit applicable">
        <p>
          Le présent site et ses conditions d'utilisation sont régis par le droit français.
          Tout litige relatif à l'utilisation du site sera soumis à la compétence exclusive
          des tribunaux français.
        </p>
      </Article>

      <Article number={6} title="Médiation et règlement des litiges">
        <p>
          Conformément aux articles L.611-1 et suivants du Code de la consommation, en cas de
          litige, le consommateur peut recourir gratuitement à un médiateur de la consommation.
        </p>
        <p>
          Plateforme européenne de règlement en ligne des litiges (RLL) :{' '}
          <ExternalLink href="https://ec.europa.eu/consumers/odr">
            ec.europa.eu/consumers/odr
          </ExternalLink>
        </p>
      </Article>

      <Article number={7} title="Contact">
        <Ul items={[
          <>Email : <Mail /></>,
          "Délai de réponse : 72 heures ouvrées maximum",
        ]} />
      </Article>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Politique de Cookies
// ─────────────────────────────────────────────────────────

function Cookies() {
  const cookiesNecessaires = [
    { name: 'mycarecoach-coach-session', role: "Session d'authentification coach (interface web)", duree: 'Session' },
    { name: 'mycarecoach-client-session', role: "Session d'authentification client (PWA mobile)", duree: 'Session' },
  ];
  const cookiesPref = [
    { name: 'theme', role: 'Préférence de thème (clair/sombre)', duree: '12 mois' },
    { name: 'lang', role: 'Préférence de langue', duree: '12 mois' },
  ];

  return (
    <>
      <LegalH1>Politique de Cookies</LegalH1>
      <UpdateDate date="15 mars 2025" />

      <Article number={1} title="Qu'est-ce qu'un cookie ?">
        <p>
          Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, smartphone,
          tablette) lors de la consultation d'un site web ou d'une application. Il permet de mémoriser
          des informations sur votre session et vos préférences.
        </p>
        <p>
          MyCareCoach utilise des cookies et des technologies similaires (localStorage, sessionStorage)
          pour assurer le bon fonctionnement de la plateforme et améliorer votre expérience.
        </p>
      </Article>

      <Article number={2} title="Cookies utilisés par MyCareCoach">
        <p><strong style={{ color: '#1A2B4A' }}>Cookies strictement nécessaires</strong> (pas de consentement requis) :</p>
        <div className="overflow-x-auto my-3">
          <table className="w-full text-sm border-collapse rounded-xl overflow-hidden" style={{ minWidth: '360px' }}>
            <thead>
              <tr style={{ background: '#F0FAF7' }}>
                {['Nom', 'Rôle', 'Durée'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: '#1A2B4A', borderBottom: '2px solid #00C896', fontSize: '13px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cookiesNecessaires.map(({ name, role, duree }, i) => (
                <tr key={name} style={{ background: i % 2 === 0 ? 'white' : '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#00C896' }}>{name}</td>
                  <td className="px-4 py-3 text-gray-600">{role}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{duree}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p><strong style={{ color: '#1A2B4A' }}>Cookies de préférences :</strong></p>
        <div className="overflow-x-auto my-3">
          <table className="w-full text-sm border-collapse rounded-xl overflow-hidden" style={{ minWidth: '360px' }}>
            <thead>
              <tr style={{ background: '#F0FAF7' }}>
                {['Nom', 'Rôle', 'Durée'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: '#1A2B4A', borderBottom: '2px solid #00C896', fontSize: '13px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cookiesPref.map(({ name, role, duree }, i) => (
                <tr key={name} style={{ background: i % 2 === 0 ? 'white' : '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#00C896' }}>{name}</td>
                  <td className="px-4 py-3 text-gray-600">{role}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{duree}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p><strong style={{ color: '#1A2B4A' }}>Cookies analytiques</strong> (avec consentement uniquement) :</p>
        <p>
          MyCareCoach peut utiliser des outils d'analyse d'audience anonymisés pour mesurer
          la fréquentation et améliorer le service. Ces cookies ne sont déposés qu'après votre accord explicite.
        </p>

        <p><strong style={{ color: '#1A2B4A' }}>Cookies tiers :</strong></p>
        <Ul items={[
          "Google OAuth : si vous vous connectez via Google, Google peut déposer des cookies liés à votre session Google. Ces cookies sont régis par la politique de confidentialité de Google.",
        ]} />
      </Article>

      <Article number={3} title="Durée de conservation">
        <Ul items={[
          "Cookies de session : supprimés automatiquement à la fermeture du navigateur ou après déconnexion.",
          "Cookies de préférences : conservés 12 à 13 mois maximum.",
          "Cookies analytiques (avec consentement) : 13 mois maximum (recommandation CNIL).",
        ]} />
      </Article>

      <Article number={4} title="Gestion de vos préférences cookies">
        <p>Vous pouvez gérer vos préférences cookies de plusieurs manières :</p>
        <p>
          <strong style={{ color: '#1A2B4A' }}>Depuis l'application MyCareCoach :</strong>{' '}
          les préférences de cookies analytiques sont gérables depuis les paramètres de votre compte.
        </p>
        <p><strong style={{ color: '#1A2B4A' }}>Depuis votre navigateur :</strong></p>
        <Ul items={[
          "Chrome : Paramètres → Confidentialité et sécurité → Cookies",
          "Firefox : Options → Vie privée et sécurité → Cookies",
          "Safari : Préférences → Confidentialité → Cookies",
          "Edge : Paramètres → Confidentialité, recherche et services → Cookies",
        ]} />
        <p className="text-sm text-gray-500 italic">
          ⚠️ La désactivation des cookies strictement nécessaires peut empêcher le fonctionnement
          de la plateforme (authentification impossible).
        </p>
      </Article>

      <Article number={5} title="Cookies et données de santé">
        <p>
          MyCareCoach ne stocke <strong>jamais</strong> de données de santé (métriques, mesures
          corporelles, données médicales) dans des cookies ou dans le localStorage du navigateur.
        </p>
        <p>
          Ces données sont exclusivement stockées dans notre base de données sécurisée, chiffrées
          et accessibles uniquement via une session authentifiée.
        </p>
      </Article>

      <Article number={6} title="Mise à jour de la politique">
        <p>
          La présente politique de cookies peut être mise à jour pour refléter des évolutions
          techniques ou réglementaires. Vous serez informé de tout changement significatif par
          une notification dans l'application ou par email.
        </p>
      </Article>

      <Article number={7} title="Contact et CNIL">
        <Ul items={[
          <>Email : <Mail /></>,
        ]} />
        <p>
          Pour en savoir plus sur les cookies et vos droits :{' '}
          <ExternalLink href="https://www.cnil.fr/fr/cookies-et-autres-traceurs">
            www.cnil.fr/fr/cookies-et-autres-traceurs
          </ExternalLink>
        </p>
      </Article>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Métadonnées des pages légales
// ─────────────────────────────────────────────────────────

const LEGAL_META: Record<LegalType, { breadcrumb: string; component: () => React.JSX.Element }> = {
  'cgu':             { breadcrumb: 'CGU',              component: CGU },
  'confidentialite': { breadcrumb: 'Confidentialité',  component: Confidentialite },
  'mentions-legales':{ breadcrumb: 'Mentions légales', component: MentionsLegales },
  'cookies':         { breadcrumb: 'Cookies',          component: Cookies },
};

// ─────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────

export default function LegalPage({ type }: { type: LegalType }) {
  const { breadcrumb, component: Content } = LEGAL_META[type];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif", colorScheme: 'light' }}
    >
      <LandingHeader />

      <main className="flex-1 pt-16" style={{ background: '#FAFAFA' }}>
        {/* Fil d'Ariane */}
        <div style={{ background: '#F0FAF7', borderBottom: '1px solid rgba(0,200,150,0.15)' }}>
          <div className="max-w-[800px] mx-auto px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#00C896] transition-colors">Accueil</Link>
            <span className="text-gray-300">›</span>
            <span style={{ color: '#1A2B4A', fontWeight: 500 }}>{breadcrumb}</span>
          </div>
        </div>

        {/* Contenu légal */}
        <div className="max-w-[800px] mx-auto px-6 py-10">
          <Content />

          {/* Lien retour en bas */}
          <div className="mt-10 pt-8 border-t border-gray-200 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00C896, #00E5FF)' }}
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
