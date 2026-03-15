import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient as supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Heart, Lock, CheckCircle } from 'lucide-react';

export default function ClientSetup() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase parse automatiquement le token d'invitation dans l'URL (#access_token=...)
    // On attend que la session soit disponible
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setReady(true);
        setChecking(false);
      } else if (event === 'INITIAL_SESSION' && !session) {
        setChecking(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate('/client'), 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du mot de passe.');
    } finally {
      setLoading(false);
    }
  }

  // Chargement initial
  if (checking) {
    return (
      <div className="min-h-screen bg-[#F0FAF7] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00C896] to-[#00E5FF] flex items-center justify-center shadow-xl"
        >
          <Heart className="text-white" size={32} fill="white" />
        </motion.div>
      </div>
    );
  }

  // Lien expiré ou invalide
  if (!ready) {
    return (
      <div className="min-h-screen bg-[#F0FAF7] flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00C896] to-[#00E5FF] flex items-center justify-center shadow-xl mb-6">
          <Heart className="text-white" size={40} fill="white" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Lien expiré</h1>
        <p className="text-gray-500 text-center text-sm">
          Ce lien d'invitation n'est plus valide.<br />Demandez à votre coach de vous renvoyer une invitation.
        </p>
      </div>
    );
  }

  // Succès
  if (done) {
    return (
      <div className="min-h-screen bg-[#F0FAF7] flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
          className="flex flex-col items-center"
        >
          <CheckCircle size={80} className="text-[#00C896] mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Mot de passe créé !</h1>
          <p className="text-gray-500 text-sm">Redirection vers votre espace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FAF7] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00C896] to-[#00E5FF] flex items-center justify-center shadow-xl shadow-[#00C896]/30 mb-4">
          <Heart className="text-white" size={40} fill="white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">MyCareCoach</h1>
      </motion.div>

      {/* Carte */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 25, delay: 0.1 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-black/5 p-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#00C896]/10 flex items-center justify-center">
            <Lock size={20} className="text-[#00C896]" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Bienvenue !</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Créez votre mot de passe pour accéder à votre espace personnel
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-2xl mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Au moins 8 caractères"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#00C896] focus:border-transparent outline-none bg-gray-50"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#00C896] focus:border-transparent outline-none bg-gray-50"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-[#00C896] text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#00C896]/30 disabled:opacity-60 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              'Accéder à mon espace'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
