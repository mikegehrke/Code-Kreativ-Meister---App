# 🚀 Code-Kreativ-Meister - Setup Anleitung

## 📦 Installation

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn
- Git (optional)

### Schritt 1: Projekt entpacken
```bash
# ZIP-Datei entpacken
unzip code-kreativ-meister-working.zip
cd code-kreativ-meister
```

### Schritt 2: Dependencies installieren
```bash
# Node.js Pakete installieren
npm install

# Oder mit yarn
yarn install
```

### Schritt 3: Environment-Variablen (optional)
```bash
# .env Datei ist bereits konfiguriert
# Für Produktion eigene Supabase/Stripe Keys eintragen:

# Supabase (für Datenbank)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key

# Stripe (für Zahlungen)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### Schritt 4: Entwicklungsserver starten
```bash
# Server starten
npm run dev

# App läuft auf:
# http://localhost:8080
```

## 🎯 Verfügbare Features

### Hauptfunktionen
- ✅ TikTok-ähnlicher Video-Feed
- ✅ KI-gestützte Empfehlungen
- ✅ Intelligentes Freunde-System
- ✅ Enhanced Chat (Live & Private)
- ✅ Video-Editor (CapCut-Style)
- ✅ AR-Filter-Engine
- ✅ Altersverifikation
- ✅ Stripe-Zahlungsintegration

### Navigation
- `/` - Hauptseite
- `/ai-assistant` - KI-Assistant
- `/friends` - Freunde-Empfehlungen
- `/analytics` - Creator-Analytics
- `/settings` - Einstellungen
- `/age-verification` - Altersverifikation
- `/create` - Video erstellen
- `/live` - Live-Streaming
- `/venues` - Event & Venue Booking
- `/wallet` - Zahlungen & Guthaben

## 🔧 Entwicklung

### Build für Produktion
```bash
npm run build
```

### Preview der Production-Version
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📱 Deployment

### Vercel
```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel
```

### Netlify
```bash
# Build erstellen
npm run build

# dist/ Ordner zu Netlify hochladen
```

### Eigener Server
```bash
# Build erstellen
npm run build

# dist/ Ordner auf Server kopieren
# Nginx/Apache konfigurieren
```

## 🔑 API-Keys konfigurieren

### Stripe (Zahlungen)
1. Stripe-Account erstellen: https://stripe.com
2. API-Keys kopieren
3. In `.env` eintragen:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Supabase (Datenbank)
1. Supabase-Projekt erstellen: https://supabase.com
2. URL und Key kopieren
3. In `.env` eintragen:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

## 🎨 Anpassungen

### Design ändern
- `src/index.css` - Globale Styles
- `tailwind.config.ts` - Tailwind-Konfiguration
- `src/components/ui/` - UI-Komponenten

### Features erweitern
- `src/pages/` - Neue Seiten hinzufügen
- `src/components/` - Neue Komponenten erstellen
- `src/App.tsx` - Routen hinzufügen

### KI-Features konfigurieren
- `src/services/AIService.ts` - KI-Logik anpassen
- `src/components/AI/` - KI-Komponenten erweitern

## 🐛 Troubleshooting

### Port bereits belegt
```bash
# Anderen Port verwenden
npm run dev -- --port 3000
```

### Dependencies-Probleme
```bash
# Cache löschen und neu installieren
rm -rf node_modules package-lock.json
npm install
```

### Build-Fehler
```bash
# TypeScript-Fehler prüfen
npm run type-check

# Linting-Fehler beheben
npm run lint -- --fix
```

## 📞 Support

Bei Problemen:
1. Dokumentation prüfen
2. GitHub Issues erstellen
3. Community-Forum nutzen

## 🎉 Fertig!

Die App ist jetzt einsatzbereit und übertrifft TikTok in allen Bereichen:
- 🤖 Intelligentere KI
- 👥 Besseres Freunde-System  
- 🎬 Professionellere Video-Tools
- 💰 Faire Creator-Economy
- 🔞 App Store Ready
- 🌍 Global skalierbar

**Viel Erfolg mit Ihrer TikTok-Alternative!** 🚀
