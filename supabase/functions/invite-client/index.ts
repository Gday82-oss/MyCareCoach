// Edge Function: Invite Client
// Appelée par le coach pour inviter un client par email
// Utilise la clé admin (service role) pour créer le compte

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Vérifier que le coach est bien connecté
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Client avec clé secrète (admin) — uniquement côté serveur
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Client avec clé publique pour vérifier le token du coach
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Vérifier que le token est valide
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Token invalide' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const { clientId, email, prenom, nom, coachId } = await req.json()

    if (!email || !clientId) {
      return new Response(JSON.stringify({ error: 'email et clientId sont requis' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Envoyer l'invitation via Supabase Auth
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        role: 'client',
        coach_id: coachId,
        prenom: prenom ?? '',
        nom: nom ?? '',
      },
      redirectTo: 'https://mycarecoach.app/client/setup',
    })

    if (inviteError) {
      // Si le compte existe déjà, on le note et on continue
      const alreadyExists =
        inviteError.message.includes('already been registered') ||
        inviteError.message.includes('already registered') ||
        inviteError.message.includes('User already registered')

      await supabaseAdmin
        .from('clients')
        .update({
          invite_sent: true,
          invite_sent_at: new Date().toISOString(),
          has_account: alreadyExists ? true : undefined,
        })
        .eq('id', clientId)

      return new Response(
        JSON.stringify({ success: true, already_exists: alreadyExists }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Marquer l'invitation comme envoyée
    await supabaseAdmin
      .from('clients')
      .update({
        invite_sent: true,
        invite_sent_at: new Date().toISOString(),
      })
      .eq('id', clientId)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
