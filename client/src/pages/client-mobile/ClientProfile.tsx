import { useState } from 'react';
import { supabaseClient as supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Calendar, Target,
  ChevronRight, Bell, BellOff, Shield, HelpCircle, LogOut, X,
} from 'lucide-react';

interface ClientData {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  date_naissance?: string;
  objectifs?: string;
}

interface Props {
  client: ClientData | null;
}

export default function ClientProfile({ client: profil }: Props) {
  // États locaux UI — notifications persistées en localStorage
  const [notifActives, setNotifActives] = useState<boolean>(() => {
    const stored = localStorage.getItem('notif_enabled');
    return stored === null ? true : stored === 'true';
  });
  const [modale, setModale] = useState<'confidentialite' | 'support' | null>(null);

  async function handleLogout() {
    await supabase.auth.signOut(); // supabaseClient — session client isolée ✓
    window.location.href = '/client/login';
  }

  const prenom = profil?.prenom || '--';
  const nom = profil?.nom || '--';
  const email = profil?.email || '--';
  const telephone = profil?.telephone || '--';
  const objectif = profil?.objectifs?.trim() || 'Aucun objectif défini';
  const dateNaissance = profil?.date_naissance
    ? new Date(profil.date_naissance).toLocaleDateString('fr-FR')
    : '--';

  const initiales =
    (profil?.prenom?.[0] ?? '-').toUpperCase() +
    (profil?.nom?.[0] ?? '-').toUpperCase();

  const objectifVide = !profil?.objectifs?.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 pt-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Mon profil</h1>
      </div>

      {/* Avatar & nom */}
      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl"
          style={{ backgroundColor: '#00C896', boxShadow: '0 8px 30px rgba(0,200,150,0.25)' }}
        >
          {initiales}
        </div>
        <h2 className="text-xl font-bold text-gray-800 mt-4">
          {prenom} {nom}
        </h2>
        <p className="text-gray-500">{email}</p>
      </div>

      {/* Infos principales */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Phone className="text-blue-500" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Téléphone</p>
              <p className="font-medium text-gray-800">{telephone}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Calendar className="text-purple-500" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Date de naissance</p>
              <p className="font-medium text-gray-800">{dateNaissance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Objectif */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Mon objectif</h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,200,150,0.1)' }}>
              <Target style={{ color: '#00C896' }} size={20} />
            </div>
            <div>
              <p className={`font-semibold ${objectifVide ? 'text-gray-400 italic' : 'text-gray-800'}`}>
                {objectif}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Notifications */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const next = !notifActives;
            setNotifActives(next);
            localStorage.setItem('notif_enabled', String(next));
          }}
          className="w-full flex items-center gap-3 p-4 border-b border-gray-100"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
            {notifActives
              ? <Bell className="text-gray-500" size={20} />
              : <BellOff className="text-gray-400" size={20} />
            }
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-gray-800">Notifications</p>
            <p className="text-xs" style={{ color: notifActives ? '#00C896' : '#9CA3AF' }}>
              {notifActives ? 'Activées' : 'Désactivées'}
            </p>
          </div>
          {/* Toggle visuel */}
          <div
            className="w-11 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 flex-shrink-0"
            style={{ backgroundColor: notifActives ? '#00C896' : '#D1D5DB' }}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${notifActives ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </div>
        </motion.button>

        {/* Confidentialité */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setModale(m => m === 'confidentialite' ? null : 'confidentialite')}
          className="w-full flex items-center gap-3 p-4 border-b border-gray-100"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
            <Shield className="text-gray-500" size={20} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-gray-800">Confidentialité</p>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </motion.button>

        {/* Aide & Support */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setModale(m => m === 'support' ? null : 'support')}
          className="w-full flex items-center gap-3 p-4"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
            <HelpCircle className="text-gray-500" size={20} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-gray-800">Aide & Support</p>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </motion.button>
      </div>

      {/* Bloc Confidentialité */}
      <AnimatePresence>
        {modale === 'confidentialite' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-2xl border p-5"
            style={{ background: '#F0FAF7', borderColor: 'rgba(0,200,150,0.25)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield size={18} style={{ color: '#00C896' }} />
                <h4 className="font-bold text-gray-800 text-sm">Confidentialité</h4>
              </div>
              <button onClick={() => setModale(null)} className="p-1 rounded-lg hover:bg-white/60 transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Vos données sont hébergées en Europe et ne sont jamais vendues à des tiers.
              Pour toute demande RGPD :{' '}
              <a href="mailto:contact@mycarecoach.app" className="font-semibold underline" style={{ color: '#00C896' }}>
                contact@mycarecoach.app
              </a>
            </p>
            <a
              href="/confidentialite"
              className="inline-flex items-center gap-1 mt-3 text-xs font-semibold"
              style={{ color: '#00C896' }}
            >
              Voir la politique complète →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bloc Aide & Support */}
      <AnimatePresence>
        {modale === 'support' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-2xl border p-5"
            style={{ background: '#FFF8F4', borderColor: 'rgba(255,140,66,0.25)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} style={{ color: '#FF8C42' }} />
                <h4 className="font-bold text-gray-800 text-sm">Aide & Support</h4>
              </div>
              <button onClick={() => setModale(null)} className="p-1 rounded-lg hover:bg-white/60 transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Une question ? Contactez-nous :
            </p>
            <a
              href="mailto:contact@mycarecoach.app"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-85"
              style={{ background: 'linear-gradient(135deg, #FF8C42, #FFB347)' }}
            >
              contact@mycarecoach.app
            </a>
            <p className="text-xs text-gray-400 mt-3">Réponse sous 24h.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version */}
      <p className="text-center text-xs text-gray-400">
        MyCareCoach v1.0.0
      </p>

      {/* Déconnexion */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-500 rounded-2xl font-medium"
      >
        <LogOut size={20} />
        Se déconnecter
      </motion.button>
    </motion.div>
  );
}
