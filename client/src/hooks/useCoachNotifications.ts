import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook de notifications push pour le coach.
 * - Demande la permission si besoin
 * - S'abonne aux événements Supabase Realtime :
 *   • Nouvelle séance dans moins de 2h
 *   • Nouveau message client
 *   • Paiement reçu (facture payée)
 */
export function useCoachNotifications(coachId: string | null) {
  const permissionGranted = useRef(false);

  useEffect(() => {
    if (!coachId) return;

    // 1. Demander la permission notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        permissionGranted.current = permission === 'granted';
      });
    } else if (Notification.permission === 'granted') {
      permissionGranted.current = true;
    }
  }, [coachId]);

  useEffect(() => {
    if (!coachId) return;

    const sendNotif = (title: string, body: string, url = '/app') => {
      if (!permissionGranted.current) return;
      if (Notification.permission !== 'granted') return;

      // Via Service Worker pour support complet (badge, vibration)
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          body,
          url,
        });
      } else {
        // Fallback notification simple
        new Notification(title, {
          body,
          icon: '/icon-192x192.png',
        });
      }
    };

    // 2. Séances à venir dans moins de 2h
    const seancesChannel = supabase
      .channel(`coach-seances-${coachId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'seances',
          filter: `coach_id=eq.${coachId}`,
        },
        (payload) => {
          const seance = payload.new as any;
          if (!seance.date_heure) return;

          const seanceDate = new Date(seance.date_heure);
          const diff = seanceDate.getTime() - Date.now();
          const twoHours = 2 * 60 * 60 * 1000;

          if (diff > 0 && diff <= twoHours) {
            const heure = seanceDate.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            });
            sendNotif(
              'Séance bientôt',
              `Vous avez une séance à ${heure}`,
              '/app/seances'
            );
          }
        }
      )
      .subscribe();

    // 3. Paiement reçu (facture passée à "payée")
    const facturesChannel = supabase
      .channel(`coach-factures-${coachId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'factures',
          filter: `coach_id=eq.${coachId}`,
        },
        (payload) => {
          const facture = payload.new as any;
          const old = payload.old as any;
          if (facture.statut === 'payee' && old.statut !== 'payee') {
            sendNotif(
              'Paiement reçu',
              `Facture n°${facture.numero || facture.id} réglée`,
              '/app/facturation'
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(seancesChannel);
      supabase.removeChannel(facturesChannel);
    };
  }, [coachId]);
}
