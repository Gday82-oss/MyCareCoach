interface LogoProps {
  /** Hauteur totale du logo en px (défaut : 40) */
  height?: number;
  /** Variante de couleur du texte (défaut : "color") */
  textVariant?: 'color' | 'white' | 'dark';
}

/**
 * Logo MyCareCoach — cœur stylisé avec ligne ECG + texte tricolore.
 * Composant réutilisable dans Header, Footer, emails, etc.
 */
export default function Logo({ height = 40, textVariant = 'color' }: LogoProps) {
  const iconH = height;
  const iconW = Math.round(iconH * 0.95);

  // Couleurs du texte selon la variante
  const myColor    = textVariant === 'white' ? '#FFFFFF' : '#1A2B4A';
  const careColor  = textVariant === 'white' ? '#6EF0CA' : '#00C896';
  const coachColor = textVariant === 'white' ? '#FFFFFF' : '#1A2B4A';

  const fontSize   = Math.round(height * 0.48);
  const fontWeight = 700;

  return (
    <div className="flex items-center gap-2 select-none" aria-label="MyCareCoach">
      {/* ── Icône SVG : cœur + tracé ECG ── */}
      <svg
        width={iconW}
        height={iconH}
        viewBox="0 0 38 36"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-heart-grad" x1="0" y1="0" x2="38" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#00C896" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
          {/* Masque pour clipper la ligne ECG à l'intérieur du cœur */}
          <clipPath id="logo-heart-clip">
            <path d="M19 33C19 33 2 22 2 11.5C2 5.8 6.8 2 12 3.8C14.5 4.7 17 7.5 19 9.5C21 7.5 23.5 4.7 26 3.8C31.2 2 36 5.8 36 11.5C36 22 19 33 19 33Z" />
          </clipPath>
        </defs>

        {/* Cœur plein avec dégradé */}
        <path
          d="M19 33C19 33 2 22 2 11.5C2 5.8 6.8 2 12 3.8C14.5 4.7 17 7.5 19 9.5C21 7.5 23.5 4.7 26 3.8C31.2 2 36 5.8 36 11.5C36 22 19 33 19 33Z"
          fill="url(#logo-heart-grad)"
        />

        {/* Ligne ECG clippée dans le cœur */}
        <polyline
          points="2,17 6,17 8,12 10,22 12.5,6 15,26 17,17 36,17"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          clipPath="url(#logo-heart-clip)"
          opacity="0.9"
        />
      </svg>

      {/* ── Texte tricolore ── */}
      <span
        className="font-display leading-none tracking-tight whitespace-nowrap"
        style={{ fontSize, fontWeight }}
      >
        <span style={{ color: myColor }}>My</span>
        <span style={{ color: careColor }}>Care</span>
        <span style={{ color: coachColor }}>Coach</span>
      </span>
    </div>
  );
}
