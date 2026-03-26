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

export default function LandingHeader() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

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
            className="rounded-full font-medium cursor-pointer transition-colors duration-200 bg-[#00C896] hover:bg-[#00B080]"
            style={{ color: 'white', border: 'none', borderRadius: '9999px', padding: '13px 40px', fontSize: '15px', fontWeight: 500, whiteSpace: 'nowrap', minWidth: '160px', textAlign: 'center' }}>
            Espace Coach
          </Link>
          <Link to="/client/login"
            className="rounded-full font-medium cursor-pointer transition-colors duration-200 bg-[#6C5CE7] hover:bg-[#4834D4]"
            style={{ color: 'white', border: 'none', borderRadius: '9999px', padding: '13px 40px', fontSize: '15px', fontWeight: 500, whiteSpace: 'nowrap', minWidth: '160px', textAlign: 'center' }}>
            Espace Client
          </Link>
          <Link to="/register"
            className="rounded-full font-medium cursor-pointer transition-colors duration-200 bg-[#38BDF8] hover:bg-[#0EA5E9]"
            style={{ color: 'white', border: 'none', borderRadius: '9999px', padding: '12px 28px', fontSize: '15px', fontWeight: 500 }}>
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
              className="block text-center rounded-full font-medium cursor-pointer transition-colors duration-200 bg-[#00C896] hover:bg-[#00B080]"
              style={{ color: 'white', border: 'none', borderRadius: '9999px', padding: '13px 40px', fontSize: '15px', fontWeight: 500, whiteSpace: 'nowrap' }}>
              Espace Coach
            </Link>
            <Link to="/client/login" onClick={() => setOpen(false)}
              className="block text-center rounded-full font-medium cursor-pointer transition-colors duration-200 bg-[#6C5CE7] hover:bg-[#4834D4]"
              style={{ color: 'white', border: 'none', borderRadius: '9999px', padding: '13px 40px', fontSize: '15px', fontWeight: 500, whiteSpace: 'nowrap' }}>
              Espace Client
            </Link>
            <Link to="/register" onClick={() => setOpen(false)}
              className="block text-center rounded-full font-medium cursor-pointer transition-colors duration-200 bg-[#38BDF8] hover:bg-[#0EA5E9]"
              style={{ color: 'white', border: 'none', borderRadius: '9999px', padding: '12px 28px', fontSize: '15px', fontWeight: 500 }}>
              S'inscrire gratuitement
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
