import { Link } from 'react-router-dom';
import Logo from './Logo';

function scrollToId(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
}

export default function LandingFooter() {
  return (
    <footer style={{ background: '#0D1B2A' }} className="text-gray-400 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/8">

          {/* Brand */}
          <div>
            <Logo height={34} textVariant="white" />
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              La plateforme tout-en-un pour coachs sportifs.
              Sport-santé sur ordonnance · Remboursé mutuelle.
            </p>
            <div className="flex flex-wrap gap-2 mt-5" style={{ maxWidth: '280px' }}>
              <Link to="/login"
                className="cursor-pointer transition-opacity duration-200 hover:opacity-[0.82]"
                style={{ background: 'linear-gradient(135deg, #1A2B4A, #2a4070)', color: 'white', border: 'none', borderRadius: '9999px', padding: '10px 24px', fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', minWidth: '130px', textAlign: 'center' }}>
                Espace Coach
              </Link>
              <Link to="/client/login"
                className="cursor-pointer transition-opacity duration-200 hover:opacity-[0.82]"
                style={{ background: 'linear-gradient(135deg, #00C896, #00a87e)', color: 'white', border: 'none', borderRadius: '9999px', padding: '10px 24px', fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', minWidth: '130px', textAlign: 'center' }}>
                Espace Client
              </Link>
            </div>
          </div>

          {/* Produit */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-4">Produit</h4>
            <ul className="space-y-2.5">
              <li><a href="#fonctionnalites" onClick={scrollToId('fonctionnalites')} className="text-sm text-gray-500 hover:text-[#00C896] transition-colors">Fonctionnalités</a></li>
              <li><a href="#tarifs" onClick={scrollToId('tarifs')} className="text-sm text-gray-500 hover:text-[#00C896] transition-colors">Tarifs</a></li>
              <li><a href="#temoignages" onClick={scrollToId('temoignages')} className="text-sm text-gray-500 hover:text-[#00C896] transition-colors">Témoignages</a></li>
              <li><Link to="/register" className="text-sm text-gray-500 hover:text-[#00C896] transition-colors">Essai gratuit</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-4">Légal</h4>
            <ul className="space-y-2.5">
              <li><Link to="/cgu" className="text-sm text-gray-500 hover:text-[#00C896] transition-colors">CGU</Link></li>
              <li><Link to="/confidentialite" className="text-sm text-gray-500 hover:text-[#00C896] transition-colors">Confidentialité</Link></li>
              <li><Link to="/mentions-legales" className="text-sm text-gray-500 hover:text-[#00C896] transition-colors">Mentions légales</Link></li>
              <li><Link to="/cookies" className="text-sm text-gray-500 hover:text-[#00C896] transition-colors">Cookies</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-4">Contact</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:contact@mycarecoach.app" className="text-sm text-gray-500 hover:text-[#00C896] transition-colors">
                  Nous contacter
                </a>
              </li>
              <li>
                <a href="mailto:contact@mycarecoach.app" className="text-sm text-gray-500 hover:text-[#00C896] transition-colors break-all">
                  contact@mycarecoach.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>© 2025 MyCareCoach. Tous droits réservés.</p>
          <p>Fait avec ♥ pour les coachs sportifs de France</p>
        </div>
      </div>
    </footer>
  );
}
