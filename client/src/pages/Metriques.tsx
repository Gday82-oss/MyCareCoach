import { useEffect, useState } from 'react';
import { supabase, ensureCoachProfile } from '../lib/supabase';
import { Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Metrique {
  id: string;
  date: string;
  poids?: number;
  tour_de_taille?: number;
  tour_de_hanches?: number;
  energie?: number;
  sommeil?: number;
  note?: string;
  client_id: string;
  client?: { prenom: string; nom: string };
}

interface Client {
  id: string;
  prenom: string;
  nom: string;
  taille?: number;
}

function calcIMC(poids: number, tailleCm: number) {
  const m = tailleCm / 100;
  return parseFloat((poids / (m * m)).toFixed(1));
}

function imcBadge(imc: number) {
  if (imc < 18.5) return { label: 'Insuffisance pondérale', color: '#F97316', bg: '#FFF7ED' };
  if (imc < 25)   return { label: 'Poids normal',           color: '#00C896', bg: '#E1F5EE' };
  if (imc < 30)   return { label: 'Surpoids',               color: '#F97316', bg: '#FFF7ED' };
  return           { label: 'Obésité',                       color: '#EF4444', bg: '#FEF2F2' };
}

export default function Metriques() {
  const [metriques, setMetriques] = useState<Metrique[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Pour l'IMC dans le formulaire
  const [formPoids, setFormPoids] = useState('');
  const [formTaille, setFormTaille] = useState('');
  const [formClientId, setFormClientId] = useState('');

  useEffect(() => { fetchData(); }, [selectedClient]);

  async function fetchData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await ensureCoachProfile(user);

      const { data: clientsData } = await supabase
        .from('clients')
        .select('id, prenom, nom, taille')
        .eq('coach_id', user.id);

      setClients(clientsData || []);

      const clientIds = (clientsData || []).map((c: any) => c.id);

      let query = supabase
        .from('metriques')
        .select('id, date, poids, tour_de_taille, tour_de_hanches, energie, sommeil, note, client_id, client:clients(prenom, nom)')
        .in('client_id', clientIds.length > 0 ? clientIds : [''])
        .order('date', { ascending: true });

      if (selectedClient) query = query.eq('client_id', selectedClient);

      const { data: metriquesData } = await query;
      setMetriques((metriquesData || []) as unknown as Metrique[]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }

  const selectedClientData = clients.find(c => c.id === selectedClient);
  const chartData = [...metriques]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(m => {
      const taille = selectedClientData?.taille;
      const imc = (m.poids && taille) ? parseFloat((m.poids / Math.pow(taille / 100, 2)).toFixed(1)) : null;
      return {
        date: new Date(m.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        poids: m.poids ?? null,
        imc,
        tour_de_taille: m.tour_de_taille ?? null,
        tour_de_hanches: m.tour_de_hanches ?? null,
        energie: m.energie ?? null,
        sommeil: m.sommeil ?? null,
      };
    });

  // IMC dans le formulaire
  const formPoidsNum = parseFloat(formPoids);
  const formTailleNum = parseFloat(formTaille);
  const imcVal = formPoidsNum && formTailleNum ? calcIMC(formPoidsNum, formTailleNum) : null;
  const badge = imcVal ? imcBadge(imcVal) : null;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C896]"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-[#E8EDF5]">Métriques</h1>
          <p className="text-gray-600 dark:text-[#A8B4C4] mt-1">Suivi de la progression</p>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true);
            setFormPoids('');
            setFormClientId(selectedClient);
            const clientData = clients.find(c => c.id === selectedClient);
            setFormTaille(clientData?.taille?.toString() || '');
          }}
          className="flex items-center gap-2 bg-[#00C896] text-white px-4 md:px-6 py-3 rounded-xl hover:bg-[#00B080] shadow-lg shadow-[#00C896]/25 min-h-[44px]"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Ajouter des métriques</span>
          <span className="sm:hidden">Ajouter</span>
        </button>
      </div>

      {/* Filtre client */}
      <div className="mb-6">
        <select
          value={selectedClient}
          onChange={e => setSelectedClient(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-[#2E3D55] rounded-xl focus:ring-2 focus:ring-[#00C896]"
        >
          <option value="">Tous les clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
        </select>
      </div>


      {/* Liste */}
      <div className="bg-white dark:bg-[#1A2535] rounded-xl shadow-sm border border-gray-100 dark:border-[#2E3D55] overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-[#2E3D55]">
          <h2 className="text-lg font-semibold dark:text-white">Historique des mesures</h2>
        </div>

        {metriques.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-[#8896A8]">Aucune métrique enregistrée</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {metriques.slice().reverse().map(m => {
              const clientRow = clients.find(c => c.id === m.client_id);
              const mImc = m.poids && clientRow?.taille ? calcIMC(m.poids, clientRow.taille) : null;
              const mBadge = mImc ? imcBadge(mImc) : null;
              return (
                <div key={m.id} className="p-4 hover:bg-gray-50 dark:bg-[#0F1923]">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#00C896]/15 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar size={18} className="text-[#00C896]" />
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">{new Date(m.date).toLocaleDateString('fr-FR')}</p>
                        {m.client && <p className="text-sm text-gray-500 dark:text-[#8896A8]">{m.client.prenom} {m.client.nom}</p>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm items-center">
                      {m.poids != null && <span className="text-gray-600 dark:text-[#A8B4C4]"><strong>{m.poids} kg</strong></span>}
                      {mImc && mBadge && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: mBadge.color, background: mBadge.bg }}>
                          IMC {mImc} — {mBadge.label}
                        </span>
                      )}
                      {m.tour_de_taille != null && <span className="text-gray-500">T: {m.tour_de_taille} cm</span>}
                      {m.tour_de_hanches != null && <span className="text-gray-500">H: {m.tour_de_hanches} cm</span>}
                      {m.energie != null && <span className="text-amber-600">⚡ {m.energie}/10</span>}
                      {m.sommeil != null && <span className="text-purple-600">🌙 {m.sommeil}/10</span>}
                    </div>
                  </div>
                  {m.note && <p className="text-xs italic text-gray-400 mt-1 ml-14">"{m.note}"</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Graphiques de progression */}
      {selectedClient && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1A2B4A' }}>
            Graphiques de progression
          </h2>

          {metriques.length < 2 ? (
            <div className="bg-white dark:bg-[#1A2535] rounded-xl border border-gray-100 dark:border-[#2E3D55] p-8 text-center text-gray-400 dark:text-[#8896A8] text-sm">
              Enregistrez au moins 2 mesures pour voir l'évolution
            </div>
          ) : (
            <div className="space-y-6">

              {/* Graphique 1 — Poids & IMC */}
              {chartData.filter(d => d.poids != null).length >= 2 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#1A2535] rounded-xl border border-gray-100 dark:border-[#2E3D55] p-4">
                  <h3 className="text-base font-medium mb-4" style={{ color: '#1A2B4A' }}>Poids & IMC</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="poids" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                      <YAxis yAxisId="imc" orientation="right" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip
                        contentStyle={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12 }}
                        formatter={(value: unknown, name: string | undefined) => [
                          name === 'Poids' ? `${value} kg` : `${value}`,
                          name ?? '',
                        ]}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                      <Line yAxisId="poids" type="monotone" dataKey="poids" stroke="#1A2B4A" strokeWidth={2} dot={{ fill: '#1A2B4A', r: 3 }} activeDot={{ r: 5 }} name="Poids" connectNulls />
                      {chartData.some(d => d.imc != null) && (
                        <Line yAxisId="imc" type="monotone" dataKey="imc" stroke="#00C896" strokeWidth={2} strokeDasharray="4 2" dot={{ fill: '#00C896', r: 3 }} activeDot={{ r: 5 }} name="IMC" connectNulls />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {/* Graphique 2 — Mensurations */}
              {(chartData.filter(d => d.tour_de_taille != null).length >= 2 || chartData.filter(d => d.tour_de_hanches != null).length >= 2) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-[#1A2535] rounded-xl border border-gray-100 dark:border-[#2E3D55] p-4">
                  <h3 className="text-base font-medium mb-4" style={{ color: '#1A2B4A' }}>Mensurations</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} unit=" cm" />
                      <Tooltip
                        contentStyle={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12 }}
                        formatter={(value: unknown, name: string | undefined) => [`${value} cm`, name ?? '']}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                      <Line type="monotone" dataKey="tour_de_taille" stroke="#00C896" strokeWidth={2} dot={{ fill: '#00C896', r: 3 }} activeDot={{ r: 5 }} name="Tour de taille" connectNulls />
                      <Line type="monotone" dataKey="tour_de_hanches" stroke="#9333EA" strokeWidth={2} dot={{ fill: '#9333EA', r: 3 }} activeDot={{ r: 5 }} name="Tour de hanches" connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {/* Graphique 3 — Bien-être */}
              {(chartData.filter(d => d.energie != null).length >= 2 || chartData.filter(d => d.sommeil != null).length >= 2) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-[#1A2535] rounded-xl border border-gray-100 dark:border-[#2E3D55] p-4">
                  <h3 className="text-base font-medium mb-4" style={{ color: '#1A2B4A' }}>Bien-être</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 10]} tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12 }}
                        formatter={(value: unknown, name: string | undefined) => [`${value}/10`, name ?? '']}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                      <Line type="monotone" dataKey="energie" stroke="#FBBF24" strokeWidth={2} dot={{ fill: '#FBBF24', r: 3 }} activeDot={{ r: 5 }} name="Énergie ⚡" connectNulls />
                      <Line type="monotone" dataKey="sommeil" stroke="#60A5FA" strokeWidth={2} dot={{ fill: '#60A5FA', r: 3 }} activeDot={{ r: 5 }} name="Sommeil 🌙" connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Modal ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex md:items-center md:justify-center items-end z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1A2535] rounded-t-2xl md:rounded-2xl p-6 md:p-8 w-full md:max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Nouvelles métriques</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = e.target as HTMLFormElement;
              const data = new FormData(fd);
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return;
              await ensureCoachProfile(user);

              const payload: Record<string, any> = {
                client_id: data.get('client_id'),
                date: data.get('date'),
              };
              const p = parseFloat(data.get('poids') as string);
              const tt = parseFloat(data.get('tour_de_taille') as string);
              const th = parseFloat(data.get('tour_de_hanches') as string);
              const en = parseInt(data.get('energie') as string);
              const so = parseInt(data.get('sommeil') as string);
              const no = (data.get('note') as string)?.trim();
              if (!isNaN(p))  payload.poids           = p;
              if (!isNaN(tt)) payload.tour_de_taille  = tt;
              if (!isNaN(th)) payload.tour_de_hanches = th;
              if (!isNaN(en)) payload.energie          = en;
              if (!isNaN(so)) payload.sommeil          = so;
              if (no)         payload.note             = no;

              console.log('[Metriques coach] Payload insert:', payload);
              const { error: insertError } = await supabase.from('metriques').insert([payload]);
              if (insertError) {
                console.error('[Metriques coach] Erreur insert:', insertError.message, insertError.details, insertError.hint);
                setSaveError(insertError.message);
                return;
              }

              // Mettre à jour la taille du client si renseignée
              const tailleNum = parseFloat(formTaille);
              if (!isNaN(tailleNum) && tailleNum > 0) {
                await supabase.from('clients').update({ taille: tailleNum }).eq('id', payload.client_id);
              }

              setSaveError('');
              setShowAddModal(false);
              setFormPoids('');
              setFormTaille('');
              setFormClientId('');
              fetchData();
            }}>
              <div className="space-y-4">
                {/* Client */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Client *</label>
                  <select
                    name="client_id"
                    required
                    value={formClientId}
                    onChange={e => {
                      const cid = e.target.value;
                      setFormClientId(cid);
                      const clientData = clients.find(c => c.id === cid);
                      setFormTaille(clientData?.taille?.toString() || '');
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00C896] dark:bg-[#0F1923] dark:border-[#2E3D55] dark:text-white"
                  >
                    <option value="">Choisir...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Date *</label>
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00C896] dark:bg-[#0F1923] dark:border-[#2E3D55] dark:text-white"
                  />
                </div>

                {/* Poids | Taille */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">Poids (kg)</label>
                    <input
                      name="poids"
                      type="number"
                      step="0.1"
                      placeholder="Ex : 74.5"
                      value={formPoids}
                      onChange={e => setFormPoids(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00C896] dark:bg-[#0F1923] dark:border-[#2E3D55] dark:text-white"
                    />
                    <p className="text-xs text-gray-400 mt-0.5">À jeun, le matin</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">Taille (cm)</label>
                    <input
                      type="number"
                      step="1"
                      placeholder="Ex : 175"
                      value={formTaille}
                      onChange={e => setFormTaille(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00C896] dark:bg-[#0F1923] dark:border-[#2E3D55] dark:text-white"
                    />
                    <p className="text-xs text-gray-400 mt-0.5">En centimètres</p>
                  </div>
                </div>

                {/* IMC calculé automatiquement */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">IMC calculé automatiquement</label>
                  <div className="px-4 py-3 border rounded-lg min-h-[48px] flex items-center gap-3"
                    style={{ background: badge ? badge.bg : '#E1F5EE', borderColor: badge ? badge.color + '40' : '#d1fae5' }}>
                    {imcVal && badge ? (
                      <>
                        <span className="font-bold text-xl" style={{ color: badge.color }}>{imcVal}</span>
                        <span className="text-sm font-semibold px-2 py-0.5 rounded-full"
                          style={{ color: badge.color, background: badge.color + '20' }}>{badge.label}</span>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">Renseignez le poids et la taille</p>
                    )}
                  </div>
                </div>

                {/* Tour de taille | Tour de hanches */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">Tour de taille (cm)</label>
                    <input
                      name="tour_de_taille"
                      type="number"
                      step="0.5"
                      placeholder="Ex : 82"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00C896] dark:bg-[#0F1923] dark:border-[#2E3D55] dark:text-white"
                    />
                    <p className="text-xs text-gray-400 mt-0.5">Au niveau du nombril</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">Tour de hanches (cm)</label>
                    <input
                      name="tour_de_hanches"
                      type="number"
                      step="0.5"
                      placeholder="Ex : 96"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00C896] dark:bg-[#0F1923] dark:border-[#2E3D55] dark:text-white"
                    />
                    <p className="text-xs text-gray-400 mt-0.5">Au point le plus large</p>
                  </div>
                </div>

                {/* Énergie | Sommeil */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">⚡ Énergie (1-10)</label>
                    <input
                      name="energie"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="Ex : 7"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00C896] dark:bg-[#0F1923] dark:border-[#2E3D55] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">🌙 Sommeil (1-10)</label>
                    <input
                      name="sommeil"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="Ex : 8"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00C896] dark:bg-[#0F1923] dark:border-[#2E3D55] dark:text-white"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">Notes</label>
                  <textarea
                    name="note"
                    rows={2}
                    placeholder="Observations du coach..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00C896] dark:bg-[#0F1923] dark:border-[#2E3D55] dark:text-white resize-none"
                  />
                </div>
              </div>

              {saveError && (
                <div className="mt-4 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-200">
                  ⚠️ Erreur : {saveError}
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setFormPoids(''); setFormTaille(''); setFormClientId(''); setSaveError(''); }}
                  className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-[#0F1923] dark:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#00C896] text-white rounded-xl hover:bg-[#00B080]"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
