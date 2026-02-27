import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, DollarSign, Activity, Flame } from 'lucide-react';
import { AnimatedCard, FadeIn, AnimatedNumber } from '../components/animations';
import { useTheme } from '../contexts/ThemeContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { name: 'Lun', value: 120 },
  { name: 'Mar', value: 200 },
  { name: 'Mer', value: 150 },
  { name: 'Jeu', value: 280 },
  { name: 'Ven', value: 220 },
  { name: 'Sam', value: 350 },
  { name: 'Dim', value: 180 },
];

const activityData = [
  { name: 'Sem 1', seances: 12, clients: 8 },
  { name: 'Sem 2', seances: 18, clients: 10 },
  { name: 'Sem 3', seances: 15, clients: 12 },
  { name: 'Sem 4', seances: 22, clients: 15 },
];

function StatCard({ icon: Icon, label, value, color, trend }: { 
  icon: any; 
  label: string; 
  value: number; 
  color: string;
  trend?: string;
}) {
  
  return (
    <AnimatedCard className="p-6 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-full -mr-16 -mt-16 blur-2xl`} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
            <AnimatedNumber value={value} />
          </h3>
          {trend && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-emerald-500 font-medium"
            >
              +{trend}%
            </motion.span>
          )}
        </div>
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={`${color} p-3 rounded-xl`}
        >
          <Icon className="text-white" size={24} />
        </motion.div>
      </div>
    </AnimatedCard>
  );
}

function Dashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const prochainesSeances = [
    { client: 'Marie Dupont', heure: '09:00', type: 'Musculation', avatar: 'MD' },
    { client: 'Jean Martin', heure: '10:30', type: 'Cardio', avatar: 'JM' },
    { client: 'Sophie Bernard', heure: '14:00', type: 'Yoga', avatar: 'SB' },
    { client: 'Pierre Durand', heure: '16:30', type: 'Musculation', avatar: 'PD' },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <FadeIn>
        <header className="mb-8 flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent"
            >
              Dashboard
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Vue d'ensemble de ton activité</p>
          </div>
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm"
            >
              <Flame className="text-orange-500" size={20} />
              <span className="text-sm font-medium">12 jours de streak !</span>
            </motion.div>
          </div>
        </header>
      </FadeIn>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} label="Clients actifs" value={24} color="bg-blue-500" trend="12" />
        <StatCard icon={Calendar} label="Séances ce mois" value={48} color="bg-emerald-500" trend="8" />
        <StatCard icon={TrendingUp} label="Progression" value={12} color="bg-purple-500" trend="5" />
        <StatCard icon={DollarSign} label="Revenus (€)" value={2400} color="bg-amber-500" trend="15" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique Revenus */}
        <AnimatedCard className="lg:col-span-2 p-6" delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Revenus de la semaine</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Activity size={16} />
              <span>+23% vs semaine dernière</span>
            </div>
          </div>
          <div className="h-64">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e5e7eb'} />
                  <XAxis dataKey="name" stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'} />
                  <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </AnimatedCard>

        {/* Prochaines séances */}
        <AnimatedCard className="p-6" delay={0.3}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Prochaines séances</h3>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-emerald-500 text-sm font-medium"
            >
              Voir tout →
            </motion.button>
          </div>
          <div className="space-y-4">
            {prochainesSeances.map((seance, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 5, backgroundColor: theme === 'dark' ? '#334155' : '#f3f4f6' }}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 transition-colors cursor-pointer"
              >
                <motion.div 
                  whileHover={{ rotate: 10 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm"
                >
                  {seance.avatar}
                </motion.div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">{seance.client}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{seance.type}</p>
                </div>
                <span className="text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-500/20 px-3 py-1 rounded-full text-sm">
                  {seance.heure}
                </span>
              </motion.div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Graphique Activité */}
      <AnimatedCard className="mt-8 p-6" delay={0.4}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Activité mensuelle</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-500">Séances</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-500">Nouveaux clients</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e5e7eb'} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'} />
                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="seances" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </AnimatedCard>
    </div>
  );
}

export default Dashboard;