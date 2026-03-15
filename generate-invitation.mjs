// Script de génération du visuel invitation testeur MyCareCoach Pro
// Utilise Puppeteer + Chrome pour convertir HTML → PNG 1080x1080px

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ----- HTML du visuel -----
const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1080px;
    height: 1080px;
    background-color: #1A2B4A;
    font-family: -apple-system, 'Segoe UI', Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  /* Cercles décoratifs en arrière-plan */
  .bg-circle-1 {
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,150,0.06) 0%, transparent 70%);
    top: -100px; right: -100px;
  }
  .bg-circle-2 {
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,150,0.04) 0%, transparent 70%);
    bottom: -80px; left: -80px;
  }

  .card {
    width: 880px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,200,150,0.2);
    border-radius: 32px;
    padding: 64px 72px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    position: relative;
    z-index: 1;
  }

  /* LOGO */
  .logo {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 36px;
  }
  .logo-icon {
    width: 56px; height: 56px;
  }
  .logo-text {
    font-size: 28px;
    font-weight: 800;
    color: #FFFFFF;
    letter-spacing: -0.5px;
  }
  .logo-text span {
    color: #00C896;
  }

  /* BADGE INVITATION */
  .badge {
    background: rgba(0,200,150,0.12);
    border: 1.5px solid #00C896;
    border-radius: 50px;
    padding: 8px 24px;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .badge-dot {
    width: 8px; height: 8px;
    background: #00C896;
    border-radius: 50%;
    animation: none;
  }
  .badge-text {
    font-size: 14px;
    font-weight: 700;
    color: #00C896;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* TITRE PRINCIPAL */
  .main-title {
    font-size: 40px;
    font-weight: 800;
    color: #FFFFFF;
    text-align: center;
    line-height: 1.2;
    margin-bottom: 32px;
    max-width: 700px;
    letter-spacing: -0.5px;
  }

  /* BANDEAU VERT "Membre Pro gratuit à vie" */
  .pro-banner {
    background: linear-gradient(135deg, #00C896 0%, #00A878 100%);
    border-radius: 16px;
    padding: 18px 40px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 32px rgba(0,200,150,0.35);
  }
  .pro-banner-icon {
    font-size: 28px;
  }
  .pro-banner-text {
    font-size: 26px;
    font-weight: 800;
    color: #FFFFFF;
    letter-spacing: -0.3px;
  }

  /* SOUS-TITRE */
  .subtitle {
    font-size: 18px;
    color: rgba(255,255,255,0.6);
    text-align: center;
    margin-bottom: 40px;
    font-weight: 400;
  }

  /* SÉPARATEUR */
  .divider {
    width: 100%;
    height: 1px;
    background: rgba(255,255,255,0.08);
    margin-bottom: 36px;
  }

  /* AVANTAGES */
  .advantages {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 44px;
  }
  .advantage-item {
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(255,255,255,0.04);
    border-radius: 14px;
    padding: 18px 20px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .check-icon {
    width: 32px; height: 32px;
    background: rgba(0,200,150,0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .check-icon svg {
    width: 16px; height: 16px;
  }
  .advantage-text {
    font-size: 16px;
    color: rgba(255,255,255,0.85);
    font-weight: 500;
    line-height: 1.3;
  }

  /* BOUTON */
  .cta-button {
    background: linear-gradient(135deg, #00C896 0%, #00A878 100%);
    color: #FFFFFF;
    font-size: 20px;
    font-weight: 700;
    padding: 20px 60px;
    border-radius: 16px;
    text-decoration: none;
    letter-spacing: -0.2px;
    box-shadow: 0 8px 32px rgba(0,200,150,0.4);
    margin-bottom: 24px;
    display: inline-block;
  }

  /* URL */
  .url {
    font-size: 15px;
    color: rgba(255,255,255,0.4);
    letter-spacing: 1px;
  }
</style>
</head>
<body>
  <div class="bg-circle-1"></div>
  <div class="bg-circle-2"></div>

  <div class="card">

    <!-- LOGO -->
    <div class="logo">
      <svg class="logo-icon" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#00C896" fill-opacity="0.15"/>
        <path d="M28 42C28 42 12 33 12 22C12 17.029 16.029 13 21 13C23.8 13 26.3 14.3 28 16.4C29.7 14.3 32.2 13 35 13C39.971 13 44 17.029 44 22C44 33 28 42 28 42Z" fill="#00C896"/>
      </svg>
      <span class="logo-text">MyCare<span>Coach</span></span>
    </div>

    <!-- BADGE -->
    <div class="badge">
      <div class="badge-dot"></div>
      <span class="badge-text">✦ Invitation Exclusive ✦</span>
    </div>

    <!-- TITRE -->
    <h1 class="main-title">
      Vous êtes sélectionné pour tester<br>MyCareCoach Pro
    </h1>

    <!-- BANDEAU PRO -->
    <div class="pro-banner">
      <span class="pro-banner-icon">🎁</span>
      <span class="pro-banner-text">Membre Pro gratuit à vie</span>
    </div>

    <!-- SOUS-TITRE -->
    <p class="subtitle">Offre réservée aux 5 premiers coachs testeurs uniquement</p>

    <div class="divider"></div>

    <!-- 4 AVANTAGES -->
    <div class="advantages">
      <div class="advantage-item">
        <div class="check-icon">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M3 8L6.5 11.5L13 5" stroke="#00C896" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="advantage-text">Gestion illimitée des clients & séances</span>
      </div>
      <div class="advantage-item">
        <div class="check-icon">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M3 8L6.5 11.5L13 5" stroke="#00C896" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="advantage-text">Facturation & rappels automatiques</span>
      </div>
      <div class="advantage-item">
        <div class="check-icon">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M3 8L6.5 11.5L13 5" stroke="#00C896" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="advantage-text">Application mobile dédiée pour vos clients</span>
      </div>
      <div class="advantage-item">
        <div class="check-icon">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M3 8L6.5 11.5L13 5" stroke="#00C896" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="advantage-text">Assistant IA coach intégré</span>
      </div>
    </div>

    <!-- CTA BOUTON -->
    <div class="cta-button">Découvrir MyCareCoach Pro →</div>

    <!-- URL -->
    <span class="url">mycarecoach.app</span>

  </div>
</body>
</html>`;

// ----- Génération PNG avec Puppeteer -----
const outputPath = join(__dirname, 'invitation-testeur-mycarecoach.png');

console.log('🚀 Démarrage de Chrome (Puppeteer)...');
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-web-security',
  ],
  headless: true,
});

console.log('📄 Création de la page 1080x1080px...');
const page = await browser.newPage();

// Viewport exactement 1080x1080
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

// Charger le HTML directement
await page.setContent(html, { waitUntil: 'networkidle0' });

// Attendre que le rendu soit complet
await new Promise(r => setTimeout(r, 500));

console.log('📸 Capture screenshot PNG haute résolution...');
const screenshot = await page.screenshot({
  type: 'png',
  clip: { x: 0, y: 0, width: 1080, height: 1080 },
  omitBackground: false,
});

await browser.close();

// Sauvegarder
writeFileSync(outputPath, screenshot);
console.log(`✅ Image sauvegardée : ${outputPath}`);
console.log(`📐 Taille : ${(screenshot.length / 1024).toFixed(1)} KB`);
