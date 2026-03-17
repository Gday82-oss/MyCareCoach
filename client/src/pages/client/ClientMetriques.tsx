import { useEffect, useState } from 'react';
import { supabaseClient as supabase } from '../../lib/supabase';
import { TrendingUp, Scale, Moon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ClientMetriquesProps {
  client: {
    id: string;
    prenom: string;
    nom: string;
    taille?: number;
  };
}

interface Metrique {
  id: string;
  date: string;
  poids?: number;
  tour_de_taille?: number;
  tour_de_hanches?: number;
  energie?: number;
  sommeil?: number;
  note?: string;
}

function calcIMC(poids: number, tailleCm: number) {
  const m = tailleCm / 100;
  return parseFloat((poids / (m * m)).toFixed(1));
}

function imcBadge(imc: number) {
  if (imc < 18.5) return { label: 'Insuffisance pondérale', color: '#F97316' };
  if (imc < 25)   return { label: 'Poids normal',           color: '#10b981' };
  if (imc < 30)   return { label: 'Surpoids',               color: '#F97316' };
  return           { label: 'Obésité',                       color: '#EF4444' };
}

export default function ClientMetriques({ client }: ClientMetriquesProps) {
  const [metriques, setMetriques] = useState<Metrique[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetriques();
  }, [client.id]);

  async function fetchMetriques() {
    try {
      const { data } = await supabase
        .from('metriques')
        .select('id, date, poids, tour_de_taille, tour_de_hanches, energie, sommeil, note')
        .eq('client_id', client.id)
        .order('date', { ascending: true });

      setMetriques(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }

  const chartData = metriques.map(m => ({
    date: new Date(m.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    poids: m.poids,
    energie: m.energie,
    sommeil: m.sommeil,
  }));

  const last = metriques[metriques.length - 1];
  const imcVal = last?.poids && client.taille ? calcIMC(last.poids, client.taille) : null;
  const badge  = imcVal ? imcBadge(imcVal) : null;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C5CE7]"></div></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mes métriques</h1>
        <p className="text-gray-600 mt-2">Suivi de votre progression</p>
      </div>

      {/* Dernières valeurs */}
      {last && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scale size={18} className="text-[#6C5CE7]" />
              <span className="text-sm text-gray-500">Poids</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{last.poids ?? '-'} <span className="text-sm font-normal">kg</span></p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-blue-500" />
              <span className="text-sm text-gray-500">IMC</span>
            </div>
            {imcVal && badge ? (
              <>
                <p className="text-2xl font-bold" style={{ color: badge.color }}>{imcVal}</p>
                <p className="text-xs mt-0.5" style={{ color: badge.color }}>{badge.label}</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Taille manquante</p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-amber-500" />
              <span className="text-sm text-gray-500">Énergie</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{last.energie ?? '-'} <span className="text-sm font-normal">/10</span></p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Moon size={18} className="text-purple-500" />
              <span className="text-sm text-gray-500">Sommeil</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{last.sommeil ?? '-'} <span className="text-sm font-normal">/10</span></p>
          </motion.div>
        </div>
      )}

      {/* Graphiques */}
      {metriques.length > 1 && (
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Scale size={20} className="text-[#6C5CE7]" />
              Évolution du poids
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="poids" stroke="#10b981" strokeWidth={2} name="Poids (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {chartData.some(d => d.energie != null || d.sommeil != null) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Moon size={20} className="text-purple-500" />
                Énergie & Sommeil
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="energie" stroke="#f59e0b" strokeWidth={2} name="Énergie" />
                  <Line type="monotone" dataKey="sommeil" stroke="#8b5cf6" strokeWidth={2} name="Sommeil" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      )}

      {metriques.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Aucune métrique</h3>
          <p className="text-gray-500">Votre coach n'a pas encore enregistré de métriques pour vous.</p>
        </div>
      )}
    </div>
  );
}
