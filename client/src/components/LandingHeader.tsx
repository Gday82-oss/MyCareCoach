import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

function useScrolled(threshold = 10): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);
  return scrolled;
}

function scrollToId(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
}

const BTN_BASE: React.CSSProperties = {
  border: 'none',
  borderRadius: '50px',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  textAlign: 'center',
  transition: 'all 0.18s ease',
  cursor: 'pointer',
  display: 'inline-block',
  textDecoration: 'none',
  fontSize: '15px',
};

export default function LandingHeader() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const coachStyle = (id: string): React.CSSProperties => ({
    ...BTN_BASE,
    background: 'linear-gradient(135deg, #00C896, #00A876)',
    boxShadow: hovered === id
      ? '0 6px 22px rgba(0,200,150,0.50), 0 2px 6px rgba(0,0,0,0.12)'
      : '0 4px 16px rgba(0,200,150,0.38), 0 1px 4px rgba(0,0,0,0.10)',
    color: '#fff',
    transform: hovered === id ? 'translateY(-2px)' : 'none',
    filter: hovered === id ? 'brightness(1.07)' : 'none',
    padding: '13px 40px',
    minWidth: '160px',
  });

  const clientStyle = (id: string): React.CSSProperties => ({
    ...BTN_BASE,
    background: 'linear-gradient(135deg, #6C5CE7, #4834D4)',
    boxShadow: hovered === id
      ? '0 6px 22px rgba(108,92,231,0.50), 0 2px 6px rgba(0,0,0,0.12)'
      : '0 4px 16px rgba(108,92,231,0.38), 0 1px 4px rgba(0,0,0,0.10)',
    color: '#fff',
    transform: hovered === id ? 'translateY(-2px)' : 'none',
    filter: hovered === id ? 'brightness(1.07)' : 'none',
    padding: '13px 40px',
    minWidth: '160px',
  });

  const registerStyle = (id: string): React.CSSProperties => ({
    ...BTN_BASE,
    background: 'linear-gradient(135deg, #0D7A6B, #0A9B72, #00C896)',
    boxShadow: hovered === id
      ? '0 6px 22px rgba(10,155,114,0.52), 0 2px 8px rgba(0,0,0,0.14)'
      : '0 4px 16px rgba(10,155,114,0.40), 0 1px 4px rgba(0,0,0,0.12)',
    color: '#fff',
    transform: hovered === id ? 'translateY(-2px)' : 'none',
    filter: hovered === id ? 'brightness(1.07)' : 'none',
    padding: '12px 28px',
  });

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" aria-label="Accueil">
          <Logo height={36} />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1A2B4A]">
          <a href="#fonctionnalites" onClick={scrollToId('fonctionnalites')}
            className="hover:text-[#00C896] transition-colors">Fonctionnalités</a>
          <a href="#tarifs" onClick={scrollToId('tarifs')}
            className="hover:text-[#00C896] transition-colors">Tarifs</a>
          <a href="#temoignages" onClick={scrollToId('temoignages')}
            className="hover:text-[#00C896] transition-colors">À propos</a>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/login"
            style={coachStyle('coach-d')}
            onMouseEnter={() => setHovered('coach-d')}
            onMouseLeave={() => setHovered(null)}>
            Espace Coach
          </Link>
          <Link to="/client/login"
            style={clientStyle('client-d')}
            onMouseEnter={() => setHovered('client-d')}
            onMouseLeave={() => setHovered(null)}>
            Espace Client
          </Link>
          <Link to="/register"
            style={registerStyle('register-d')}
            onMouseEnter={() => setHovered('register-d')}
            onMouseLeave={() => setHovered(null)}>
            S'inscrire
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-[#1A2B4A] hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          {(['fonctionnalites', 'tarifs', 'temoignages'] as const).map((id) => (
            <a key={id}
              href={`#${id}`}
              onClick={(e) => { scrollToId(id)(e); setOpen(false); }}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#1A2B4A] hover:bg-[#F0FAF7] hover:text-[#00C896] capitalize transition-colors"
            >
              {id === 'temoignages' ? 'À propos' : id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/login" onClick={() => setOpen(false)}
              style={{ ...coachStyle('coach-m'), display: 'block', width: '100%' }}
              onMouseEnter={() => setHovered('coach-m')}
              onMouseLeave={() => setHovered(null)}>
              Espace Coach
            </Link>
            <Link to="/client/login" onClick={() => setOpen(false)}
              style={{ ...clientStyle('client-m'), display: 'block', width: '100%' }}
              onMouseEnter={() => setHovered('client-m')}
              onMouseLeave={() => setHovered(null)}>
              Espace Client
            </Link>
            <Link to="/register" onClick={() => setOpen(false)}
              style={{ ...registerStyle('register-m'), display: 'block', width: '100%' }}
              onMouseEnter={() => setHovered('register-m')}
              onMouseLeave={() => setHovered(null)}>
              S'inscrire gratuitement
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
