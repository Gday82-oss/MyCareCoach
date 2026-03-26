#!/usr/bin/env python3
"""
Post-build script: génère dist/coach.html et dist/client.html depuis dist/index.html.
Les deux fichiers ont les balises PWA codées en dur (manifest, theme-color, apple icons)
pour que Chrome lise le bon manifest AVANT que JavaScript s'exécute.
"""

import re
import sys
import os

DIST = os.path.join(os.path.dirname(__file__), 'dist')

# Lire le index.html compilé par Vite
with open(os.path.join(DIST, 'index.html'), 'r', encoding='utf-8') as f:
    base_html = f.read()

# ─────────────────────────────────────────────
# Bloc PWA à remplacer dans le HTML (tout ce
# qui se trouve entre les commentaires PWA)
# On remplace le bloc entier allant de
# "<!-- PWA Meta Tags" jusqu'au </script> du
# script inline de switching dynamique.
# ─────────────────────────────────────────────

COACH_PWA_BLOCK = """    <!-- PWA Coach — balises statiques (lues par Chrome avant JS) -->
    <meta name="theme-color" content="#00C896" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="MyCareCoach Coach" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="application-name" content="MyCareCoach Coach" />
    <meta name="format-detection" content="telephone=no" />
    <link rel="manifest" href="/manifest-coach.json" />
    <link rel="apple-touch-icon" href="/icons/coach-192.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/coach-192.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="/icons/coach-192.png" />
    <link rel="apple-touch-icon" sizes="167x167" href="/icons/coach-192.png" />
    <link rel="apple-touch-startup-image" href="/icons/coach-512.png" />
    <meta name="msapplication-TileColor" content="#00C896" />
    <meta name="msapplication-TileImage" content="/icons/coach-192.png" />"""

CLIENT_PWA_BLOCK = """    <!-- PWA Client — balises statiques (lues par Chrome avant JS) -->
    <meta name="theme-color" content="#6C5CE7" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="MyCareCoach Client" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="application-name" content="MyCareCoach Client" />
    <meta name="format-detection" content="telephone=no" />
    <link rel="manifest" href="/manifest-client.json" />
    <link rel="apple-touch-icon" href="/icons/client-192.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/client-192.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="/icons/client-192.png" />
    <link rel="apple-touch-icon" sizes="167x167" href="/icons/client-192.png" />
    <link rel="apple-touch-startup-image" href="/icons/client-512.png" />
    <meta name="msapplication-TileColor" content="#6C5CE7" />
    <meta name="msapplication-TileImage" content="/icons/client-192.png" />"""

# Regex pour capturer tout le bloc PWA dynamique (Meta Tags + Apple Icons + script inline)
# On cherche depuis "<!-- PWA Meta Tags" jusqu'à la fin du </script> du switching
PWA_DYNAMIC_BLOCK_RE = re.compile(
    r'    <!-- PWA Meta Tags.*?</script>',
    re.DOTALL
)

def generate_variant(html: str, pwa_block: str, title: str, output_file: str):
    result = PWA_DYNAMIC_BLOCK_RE.sub(pwa_block, html, count=1)
    # Mettre à jour le titre <title>
    result = re.sub(
        r'<title>[^<]*</title>',
        f'<title>{title}</title>',
        result,
        count=1
    )
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(result)
    print(f'✅ Généré : {output_file}')

generate_variant(
    base_html,
    COACH_PWA_BLOCK,
    'MyCareCoach Coach — Gérez vos clients',
    os.path.join(DIST, 'coach.html')
)

generate_variant(
    base_html,
    CLIENT_PWA_BLOCK,
    'MyCareCoach — Votre espace sport-santé',
    os.path.join(DIST, 'client.html')
)

print('HTML variants générés avec succès !')
