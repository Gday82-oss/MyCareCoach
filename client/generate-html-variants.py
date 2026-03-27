#!/usr/bin/env python3
"""
Post-build script: génère dist/coach.html et dist/client.html depuis dist/index.html.
- coach.html  : manifest-coach.json (vert #00C896) + enregistre sw-coach.js (scope /app/)
- client.html : manifest-client.json (violet #6C5CE7) + enregistre sw.js (scope /client/)
Chrome lit les balises PWA AVANT JS, donc tout est codé en dur dans ces fichiers.
"""

import re
import sys
import os

DIST = os.path.join(os.path.dirname(__file__), 'dist')

with open(os.path.join(DIST, 'index.html'), 'r', encoding='utf-8') as f:
    base_html = f.read()

# ──────────────────────────────────────────────────────────────
# Bloc PWA Coach (remplace le bloc dynamique de index.html)
# ──────────────────────────────────────────────────────────────
COACH_PWA_BLOCK = """    <!-- PWA Coach — balises statiques (lues par Chrome avant JS) -->
    <meta name="theme-color" content="#00C896" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="MyCare" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="application-name" content="MyCare" />
    <meta name="format-detection" content="telephone=no" />
    <link rel="manifest" href="/manifest-coach.json" />
    <link rel="apple-touch-icon" href="/icons/coach-192.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/coach-192.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="/icons/coach-192.png" />
    <link rel="apple-touch-icon" sizes="167x167" href="/icons/coach-192.png" />
    <link rel="apple-touch-startup-image" href="/icons/coach-512.png" />
    <meta name="msapplication-TileColor" content="#00C896" />
    <meta name="msapplication-TileImage" content="/icons/coach-192.png" />"""

# ──────────────────────────────────────────────────────────────
# Bloc PWA Client
# ──────────────────────────────────────────────────────────────
CLIENT_PWA_BLOCK = """    <!-- PWA Client — balises statiques (lues par Chrome avant JS) -->
    <meta name="theme-color" content="#6C5CE7" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="MyCareCoach" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="application-name" content="MyCareCoach" />
    <meta name="format-detection" content="telephone=no" />
    <link rel="manifest" href="/manifest-client.json" />
    <link rel="apple-touch-icon" href="/icons/client-192.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/client-192.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="/icons/client-192.png" />
    <link rel="apple-touch-icon" sizes="167x167" href="/icons/client-192.png" />
    <link rel="apple-touch-startup-image" href="/icons/client-512.png" />
    <meta name="msapplication-TileColor" content="#6C5CE7" />
    <meta name="msapplication-TileImage" content="/icons/client-192.png" />"""

# ──────────────────────────────────────────────────────────────
# Script d'enregistrement du SW Coach (remplace registerSW.js)
# ──────────────────────────────────────────────────────────────
COACH_SW_SCRIPT = """  <script>if('serviceWorker'in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw-coach.js',{scope:'/app/'}).then(function(r){console.log('[PWA Coach] SW actif, scope:',r.scope)}).catch(function(e){console.error('[PWA Coach] Erreur SW:',e)})})}</script>"""

CLIENT_SW_SCRIPT = """  <script id="vite-plugin-pwa:register-sw" src="/registerSW.js"></script>"""

# ──────────────────────────────────────────────────────────────
# Regex 1 : remplace le bloc PWA dynamique (meta tags + script)
# De "<!-- PWA Meta Tags" jusqu'au </script> du switching JS
# ──────────────────────────────────────────────────────────────
PWA_DYNAMIC_BLOCK_RE = re.compile(
    r'    <!-- PWA Meta Tags.*?</script>',
    re.DOTALL
)

# ──────────────────────────────────────────────────────────────
# Regex 2 : supprime le bloc résiduel Splash/Microsoft
# (qui reste dans le template après le bloc dynamique)
# <meta .../> se ferme avec > (et non </meta>)
# ──────────────────────────────────────────────────────────────
SPLASH_MS_RE = re.compile(
    r'\s*<!-- Splash Screens for iOS -->.*?<meta name="msapplication-TileImage"[^>]*>',
    re.DOTALL
)

# ──────────────────────────────────────────────────────────────
# Regex 3 : remplace le script registerSW.js dans </head>
# ──────────────────────────────────────────────────────────────
REGISTER_SW_RE = re.compile(
    r'  <script id="vite-plugin-pwa:register-sw"[^>]*></script>'
)


def remove_splash_ms_block(html: str) -> str:
    """Supprime le bloc Splash Screens + Microsoft résiduel du template."""
    return SPLASH_MS_RE.sub('', html, count=1)


def generate_variant(
    html: str,
    pwa_block: str,
    sw_script: str,
    title: str,
    output_file: str,
):
    # 1. Remplace le bloc PWA dynamique (meta tags + script de switching)
    result = PWA_DYNAMIC_BLOCK_RE.sub(pwa_block, html, count=1)

    # 2. Supprime le bloc Splash Screens / Microsoft résiduel du template
    result = remove_splash_ms_block(result)

    # 3. Met à jour le titre
    result = re.sub(
        r'<title>[^<]*</title>',
        f'<title>{title}</title>',
        result,
        count=1
    )

    # 4. Remplace le script registerSW.js par le bon script SW
    result = REGISTER_SW_RE.sub(sw_script, result, count=1)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(result)
    print(f'✅ Généré : {output_file}')


generate_variant(
    base_html,
    COACH_PWA_BLOCK,
    COACH_SW_SCRIPT,
    'MyCare — Gérez vos clients',
    os.path.join(DIST, 'coach.html')
)

generate_variant(
    base_html,
    CLIENT_PWA_BLOCK,
    CLIENT_SW_SCRIPT,
    'MyCareCoach — Votre espace sport-santé',
    os.path.join(DIST, 'client.html')
)

print('HTML variants générés avec succès !')
