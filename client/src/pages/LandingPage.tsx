import { useState, useEffect, useRef, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, Dumbbell,
  Activity, FileText, Brain, Star, Check, ArrowRight,
  X, ChevronRight,
} from 'lucide-react';
import DemoModal from '../components/DemoModal';
import InstallPWABanner from '../components/InstallPWABanner';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';

// ─────────────────────────────────────────────────────────
// Hooks utilitaires
// ─────────────────────────────────────────────────────────

/** Retourne [ref, isVisible] — isVisible passe à true dès que l'élément entre dans le viewport. */
function useScrollReveal<T extends Element>(options?: IntersectionObserverInit): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─────────────────────────────────────────────────────────
// Données
// ─────────────────────────────────────────────────────────

const features = [
  { icon: LayoutDashboard, title: 'Dashboard',         description: "Vue d'ensemble temps réel : revenus, séances à venir, alertes et activité récente.",          color: '#6366F1', bg: '#EEF2FF' },
  { icon: Users,           title: 'Gestion Clients',   description: 'Fiches complètes, historique, objectifs, notes et suivi personnalisé de chaque client.',        color: '#00C896', bg: '#E6FAF5' },
  { icon: Calendar,        title: 'Planification',     description: 'Calendrier intégré pour planifier, reprogrammer et confirmer vos séances sans friction.',        color: '#0EA5E9', bg: '#E0F2FE' },
  { icon: Dumbbell,        title: 'Programmes',        description: "Créez des programmes d'entraînement personnalisés, exportez en PDF, partagez en un clic.",       color: '#F97316', bg: '#FFF7ED' },
  { icon: Activity,        title: 'Métriques',         description: "Suivez la progression de chaque client : poids, mensurations, IMC, énergie et courbes d'évolution.",  color: '#EF4444', bg: '#FEF2F2' },
  { icon: FileText,        title: 'Facturation',       description: 'Factures professionnelles, attestations mutuelle et suivi des paiements en quelques secondes.',  color: '#8B5CF6', bg: '#F5F3FF' },
  { icon: Brain,           title: 'Assistant IA',      description: "Génère des programmes personnalisés et des recommandations basées sur les données OMS et le profil de chaque client.", color: '#8B5CF6', bg: '#F5F3FF', badge: 'Pro & Business' },
];

const testimonials = [
  {
    name: 'Sophie Marchand', role: 'Coach fitness & nutrition, Lyon',
    avatar: 'SM', avatarColor: 'from-[#00C896] to-[#00E5FF]',
    text: "MyCareCoach a transformé ma façon de travailler. Je gagne 4h par semaine sur l'administratif — mes clients reçoivent leurs programmes directement sur la plateforme.",
  },
  {
    name: 'Julien Bertrand', role: 'Préparateur physique, Paris',
    avatar: 'JB', avatarColor: 'from-[#6366F1] to-[#0EA5E9]',
    text: "La gestion des attestations sportives était un cauchemar. Maintenant, c'est automatique. Je recommande à tous mes collègues qui veulent professionnaliser leur activité.",
  },
  {
    name: 'Camille Leroux', role: 'Coach running & trail, Bordeaux',
    avatar: 'CL', avatarColor: 'from-[#F97316] to-[#EF4444]',
    text: "Le suivi des métriques est bluffant. Mes clients voient leurs progrès en temps réel — ça booste leur motivation et c'est devenu un vrai argument de vente pour moi.",
  },
];

type PlanFeature = { label: string; included: boolean; badge?: string; isAI?: boolean };
type PlanGroup = { title: string; features: PlanFeature[] };
type Plan = { name: string; price: string; period: string; description: string; groups: PlanGroup[]; cta: string; ctaHref: string; highlighted: boolean };

const plans: Plan[] = [
  {
    name: 'Gratuit', price: '0', period: 'pour toujours',
    description: 'Pour démarrer sans risque.',
    groups: [
      {
        title: 'Gestion',
        features: [
          { label: '3 clients maximum', included: true },
          { label: 'Dashboard & calendrier', included: true },
          { label: 'Programmes de base', included: true },
          { label: 'Support par email', included: true },
        ],
      },
      {
        title: 'Business',
        features: [
          { label: 'Facturation & attestations', included: false },
          { label: 'Rappels automatiques', included: false },
          { label: 'Export PDF', included: false },
        ],
      },
      {
        title: 'IA',
        features: [
          { label: 'Non inclus', included: false, isAI: true },
        ],
      },
    ],
    cta: 'Commencer gratuitement', ctaHref: '/login', highlighted: false,
  },
  {
    name: 'Pro', price: '19', period: 'par mois',
    description: 'Pour les coachs qui veulent scaler.',
    groups: [
      {
        title: 'Gestion',
        features: [
          { label: 'Clients illimités', included: true },
          { label: 'Dashboard & calendrier', included: true },
          { label: 'Métriques avancées', included: true },
        ],
      },
      {
        title: 'Business',
        features: [
          { label: 'Facturation & attestations', included: true },
          { label: 'Rappels automatiques', included: true },
          { label: 'Export PDF', included: true },
          { label: 'Support prioritaire', included: true },
        ],
      },
      {
        title: 'IA',
        features: [
          { label: 'Générateur de programmes IA', included: true, badge: '50 req/mois', isAI: true },
          { label: 'Chatbot IA client', included: false, isAI: true },
        ],
      },
    ],
    cta: 'Choisir Pro', ctaHref: '/register', highlighted: true,
  },
  {
    name: 'Business', price: '49', period: 'par mois',
    description: 'Pour les structures multi-coachs.',
    groups: [
      {
        title: 'Tout de Pro inclus +',
        features: [
          { label: 'Multi-coachs', included: true },
          { label: 'Dashboard direction', included: true },
          { label: 'Gestion des permissions', included: true },
          { label: 'Intégrations avancées', included: true },
          { label: 'Support dédié 24/7', included: true },
        ],
      },
      {
        title: 'IA',
        features: [
          { label: 'Générateur de programmes IA', included: true, badge: 'Illimité', isAI: true },
          { label: 'Chatbot IA coach + client', included: true, badge: 'Illimité', isAI: true },
        ],
      },
    ],
    cta: 'Choisir Business', ctaHref: '/register', highlighted: false,
  },
];

// ─────────────────────────────────────────────────────────
// Composants de section
// ─────────────────────────────────────────────────────────

// ── Hero ─────────────────────────────────────────────────

function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 420" fill="none" aria-hidden className="w-full max-w-lg animate-float">
      <defs>
        <linearGradient id="hero-g1" x1="0" y1="0" x2="480" y2="420" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00C896" stopOpacity="0.15" />
          <stop offset="1" stopColor="#00E5FF" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="hero-g2" x1="240" y1="0" x2="240" y2="420" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00C896" />
          <stop offset="1" stopColor="#00E5FF" />
        </linearGradient>
        <filter id="hero-blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Cercles de fond */}
      <circle cx="360" cy="200" r="200" fill="url(#hero-g1)" />
      <circle cx="300" cy="260" r="120" fill="#00E5FF" fillOpacity="0.06" />
      <circle cx="160" cy="100" r="80"  fill="#00C896"  fillOpacity="0.08" />

      {/* Tracé ECG principal */}
      <path
        d="M 40,210 H 120 L 135,160 L 148,262 L 162,118 L 176,302 L 190,210 H 440"
        stroke="url(#hero-g2)" strokeWidth="2.5" strokeLinecap="round"
        className="animate-draw-line"
      />

      {/* Cœur central semi-transparent */}
      <path
        d="M 300,150 C 300,150 268,118 252,133 C 240,145 268,167 300,190 C 332,167 360,145 348,133 C 332,118 300,150 300,150Z"
        fill="url(#hero-g2)" opacity="0.18"
      />
      <path
        d="M 300,150 C 300,150 268,118 252,133 C 240,145 268,167 300,190 C 332,167 360,145 348,133 C 332,118 300,150 300,150Z"
        stroke="#00C896" strokeWidth="1.5" fill="none" opacity="0.4"
      />

      {/* Carte "Dashboard" flottante */}
      <rect x="320" y="230" width="130" height="76" rx="12" fill="white" opacity="0.9" filter="url(#hero-blur)" />
      <rect x="320" y="230" width="130" height="76" rx="12" fill="white" stroke="#00C896" strokeOpacity="0.2" strokeWidth="1" />
      <rect x="332" y="243" width="40" height="6" rx="3" fill="#00C896" opacity="0.7" />
      <rect x="332" y="254" width="60" height="4" rx="2" fill="#1A2B4A" opacity="0.2" />
      <rect x="332" y="263" width="50" height="4" rx="2" fill="#1A2B4A" opacity="0.15" />
      {/* Mini graphique dans la carte */}
      <polyline points="332,290 342,282 352,286 362,275 372,278 382,270 392,274 402,266 412,269 420,262"
        stroke="#00C896" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Points décoratifs */}
      <circle cx="80"  cy="80"  r="6"  fill="#00C896" opacity="0.4" />
      <circle cx="430" cy="70"  r="10" fill="#00E5FF" opacity="0.3" />
      <circle cx="60"  cy="330" r="8"  fill="#1A2B4A" opacity="0.12" />
      <circle cx="440" cy="350" r="5"  fill="#00C896" opacity="0.5" />
      <circle cx="200" cy="350" r="4"  fill="#00E5FF" opacity="0.4" />

      {/* Croix médicale */}
      <line x1="450" y1="150" x2="450" y2="172" stroke="#00C896" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <line x1="439" y1="161" x2="461" y2="161" stroke="#00C896" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />

      <line x1="90" y1="250" x2="90" y2="266" stroke="#1A2B4A" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
      <line x1="82" y1="258" x2="98" y2="258" stroke="#1A2B4A" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
}

function Hero() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
    <section
      className="min-h-screen flex items-center pt-16"
      style={{
        background: 'radial-gradient(ellipse at 15% 55%, rgba(0,200,150,.10) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(0,229,255,.08) 0%, transparent 50%), #F0FAF7',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Texte */}
          <div
            ref={ref}
            className={`flex-1 text-center lg:text-left transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {/* Badge animé */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(0,200,150,.12)', color: '#00A87E' }}>
              <span className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse-dot" />
              Sport-santé sur ordonnance · Remboursé mutuelle
            </span>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              <span className="text-[#1A2B4A]">L'app qui prend soin</span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #00C896 0%, #00E5FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                de votre activité
              </span>
            </h1>

            <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Consacrez-vous à ce qui compte vraiment — vos clients.
              MyCareCoach gère le reste.
            </p>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
              <Link to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base transition-all duration-200 bg-[#38BDF8] hover:bg-[#0EA5E9] hover:scale-105 hover:shadow-xl hover:shadow-[#38BDF8]/30">
                Commencer gratuitement
                <ArrowRight size={18} />
              </Link>
              <button
                onClick={() => setShowDemo(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-[#1A2B4A] bg-white border-2 border-[#1A2B4A]/10 hover:border-[#00C896] hover:text-[#00C896] transition-all duration-200">
                Voir la démo
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Stats bar avec séparateurs verticaux */}
            <div className="flex flex-wrap justify-center lg:justify-start pt-4 border-t border-[#1A2B4A]/8">
              {[
                { value: '500+', label: 'Coachs actifs' },
                { value: '98%',  label: 'Satisfaction' },
                { value: '4.9/5', label: 'Note moyenne' },
              ].map(({ value, label }, i) => (
                <div key={label} className="flex items-center">
                  {i > 0 && <div className="w-px h-8 mx-6 bg-[#1A2B4A]/15" />}
                  <div className="text-center lg:text-left">
                    <div className="font-display text-2xl font-extrabold text-[#00C896]">{value}</div>
                    <div className="text-xs text-gray-500 font-medium">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="flex-1 hidden lg:flex justify-center">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
    {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
    </>
  );
}

// ── Features ─────────────────────────────────────────────

function Features() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();

  return (
    <section id="fonctionnalites" className="bg-white">
      {/* Vague de transition depuis le hero vert */}
      <div className="overflow-hidden" style={{ marginTop: '-2px' }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full block" style={{ height: 60 }}>
          <path d="M0,0 L1440,0 L1440,30 C1080,80 360,80 0,30 Z" fill="#F0FAF7" />
        </svg>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(0,200,150,.10)', color: '#00A87E' }}>
            Fonctionnalités
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-[#1A2B4A] mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Des outils pensés par des coachs, pour des coachs. Efficaces, simples, puissants.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bg, badge }, i) => {
            const isLast = i === features.length - 1 && features.length % 3 !== 0;
            if (isLast) {
              return (
                <div key={title} className="sm:col-span-2 lg:col-span-3 flex justify-center">
                  <div className="w-full sm:max-w-[calc(50%-12px)] lg:max-w-[calc(33.333%-16px)]">
                    <FeatureCard icon={Icon} title={title} description={description} color={color} bg={bg} badge={badge} delay={i * 80} />
                  </div>
                </div>
              );
            }
            return <FeatureCard key={title} icon={Icon} title={title} description={description} color={color} bg={bg} badge={badge} delay={i * 80} />;
          })}
        </div>
      </div>
    </section>
  );

}

function FeatureCard({ icon: Icon, title, description, color, bg, badge, delay }: {
  icon: React.ElementType; title: string; description: string;
  color: string; bg: string; badge?: string; delay: number;
}) {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms`, backgroundColor: '#F8FFFE' }}
    >
      {/* Bordure colorée en haut de la carte au hover */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: color }}
      />
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
        style={{ background: bg }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-display text-lg font-bold text-[#1A2B4A]">{title}</h3>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00C896, #00a87e)' }}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      <div className="mt-4 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-full"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
}

// ── Testimonials ─────────────────────────────────────────

function Testimonials() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();

  return (
    <section id="temoignages" className="py-24" style={{ background: '#0D1B2A' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(0,200,150,.15)', color: '#00C896' }}>
            Témoignages
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-gray-400 text-lg">Des coachs partout en France qui ont franchi le pas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, avatar, avatarColor, text }, i) => (
            <TestimonialCard key={name} name={name} role={role} avatar={avatar} avatarColor={avatarColor} text={text} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, role, avatar, avatarColor, text, delay }: {
  name: string; role: string; avatar: string; avatarColor: string;
  text: string; delay: number;
}) {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{
        transitionDelay: `${delay}ms`,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Étoiles */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-gray-300 text-sm leading-relaxed mb-6">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{name}</p>
          <p className="text-gray-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}

// ── Pricing ──────────────────────────────────────────────

function Pricing() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();

  return (
    <section id="tarifs" className="py-24" style={{ background: '#F0FAF7' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(0,200,150,.12)', color: '#00A87E' }}>
            Tarifs
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-[#1A2B4A] mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Sans engagement. Changez de formule quand vous voulez.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map(({ name, price, period, description, groups, cta, ctaHref, highlighted }, i) => (
            <PricingCard key={name} name={name} price={price} period={period} description={description}
              groups={groups} cta={cta} ctaHref={ctaHref} highlighted={highlighted} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ name, price, period, description, groups, cta, ctaHref, highlighted, delay }: {
  name: string; price: string; period: string; description: string;
  groups: PlanGroup[]; cta: string; ctaHref: string; highlighted: boolean; delay: number;
}) {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`rounded-2xl p-8 relative transition-all duration-300 hover:-translate-y-1
        ${highlighted ? 'shadow-2xl scale-105' : 'hover:shadow-lg'}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{
        transitionDelay: `${delay}ms`,
        background: highlighted ? '#1A2B4A' : 'white',
        border: highlighted ? '2px solid #00C896' : '1px solid #E5E7EB',
      }}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #00C896, #00E5FF)' }}>
            ✦ Populaire
          </span>
        </div>
      )}

      <h3 className={`font-display text-xl font-extrabold mb-1 ${highlighted ? 'text-white' : 'text-[#1A2B4A]'}`}>
        {name}
      </h3>
      <p className={`text-sm mb-5 ${highlighted ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>

      <div className="flex items-end gap-1 mb-6">
        <span className={`font-display text-5xl font-extrabold ${highlighted ? 'text-white' : 'text-[#1A2B4A]'}`}>
          {price}€
        </span>
        <span className={`text-sm pb-2 ${highlighted ? 'text-gray-400' : 'text-gray-400'}`}>/{period}</span>
      </div>

      <div className="space-y-5 mb-8">
        {groups.map((group) => (
          <div key={group.title}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${highlighted ? 'text-gray-500' : 'text-gray-400'}`}>
              {group.title}
            </p>
            <ul className="space-y-2">
              {group.features.map((feat) => (
                <li key={feat.label} className="flex items-center gap-2 text-sm">
                  {feat.included ? (
                    <Check size={14} className="flex-shrink-0" style={{ color: feat.isAI ? '#00C896' : '#00C896' }} />
                  ) : (
                    <X size={14} className="flex-shrink-0 text-gray-300" />
                  )}
                  <span className={
                    feat.included
                      ? (highlighted ? 'text-gray-200' : 'text-gray-700')
                      : (highlighted ? 'text-gray-600' : 'text-gray-400')
                  }>
                    {feat.label}
                  </span>
                  {feat.badge && (
                    <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"
                      style={{ background: 'rgba(0,200,150,0.15)', color: '#00A87E' }}>
                      {feat.badge}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Link to={ctaHref}
        className="block w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white hover:shadow-lg hover:shadow-[#38BDF8]/30"
      >
        {cta}
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", colorScheme: 'light' }}>
      <LandingHeader />
      <main>
        <InstallPWABanner />
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
      </main>
      <LandingFooter />
    </div>
  );
}
