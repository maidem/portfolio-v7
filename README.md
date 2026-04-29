# Portfolio v7 — Maik Demuth

Mein persönliches Portfolio. Gebaut mit Nuxt 4, Vue 3 und TypeScript. Inhalte
liegen als Markdown im Repo, der Rest ist klassisches Webhandwerk.

## Was kann die Seite?

- Startseite mit Vorstellung und FAQ
- Projektliste (max. 3) und Detailseiten pro Projekt
- Logbuch für kurze Artikel und Notizen
- Skills-Übersicht nach Kategorien
- Kontaktformular mit Versand über SMTP
- PDF-Export, bei dem man auswählt welche Bereiche ins PDF sollen
- Light- und Dark-Mode mit Umschalter in der Navigation
- Mobile Navigation mit ausklappbaren Untermenüs für Projekte und Logbuch

## Stack

- Nuxt 4 / Vue 3 / TypeScript
- `@nuxt/content` v3 mit SQLite-Storage
- `@nuxtjs/color-mode` für Light/Dark
- `nodemailer` für den Mailversand über einen Nitro-Endpoint
- `marked` und `gray-matter` für die Markdown-Aggregation des PDF-Exports
- JetBrains Mono als Schrift, alles über CSS Custom Properties getokenisiert

## Projektstruktur

```
app/
  assets/css/        Styles und Design-Tokens
  components/        Vue-Komponenten
  layouts/           Globales Layout inkl. Navigation
  pages/             Routen
content/
  information.md     Inhalt der Startseite
  projects/*.md      Projekte
  logbuch/*.md       Logbuch-Einträge
server/api/
  contact.post.ts    SMTP-Versand
  pdf-content.get.ts Markdown-Aggregation für den PDF-Export
content.config.ts    Schemata der Content-Collections
nuxt.config.ts       Nuxt-Konfiguration
Dockerfile           Production-Container
```

## Setup

Voraussetzung: Node.js ≥ 20.

```bash
git clone <repo-url> portfolio-v7
cd portfolio-v7
npm install
cp .env.example .env       # SMTP-Werte eintragen
npm run dev
```

Der Dev-Server läuft dann auf <http://localhost:3000>.

## Skripte

```bash
npm run dev        # Entwicklung mit HMR
npm run build      # Production-Build
npm run preview    # Build lokal testen
npm run generate   # Statische Generierung
```

## Inhalte pflegen

Alle Inhalte sind reine Markdown-Dateien. Kein CMS, kein Backend.

### Projekt anlegen

Datei `content/projects/<slug>.md`:

```markdown
---
title: Mein Projekt
slug: mein-projekt
date: 2026-04-01
description: Eine kurze Beschreibung.
image: /images/projekt.jpg
technologies:
  - Nuxt 4
  - TypeScript
github: https://github.com/...
live: https://...
---

## Überblick

Markdown-Text.
```

### Logbuch-Eintrag anlegen

Datei `content/logbuch/<slug>.md`:

```markdown
---
title: Mein Logbuch-Eintrag
slug: mein-eintrag
date: 2026-04-01
description: Worum es geht.
tags:
  - Nuxt 4
  - DevOps
---

## Inhalt

Markdown-Text.
```

Die Schemata stehen in `content.config.ts`. Wenn du sie änderst, einmal
`npx nuxt prepare` laufen lassen, damit die Typen passen.

## Konfiguration

### SMTP / Umgebungsvariablen

Werden in `nuxt.config.ts` über `runtimeConfig` aus dem Environment gelesen:

| Variable      | Beschreibung                 | Beispiel              |
| ------------- | ---------------------------- | --------------------- |
| `SMTP_HOST`   | SMTP-Server                  | `smtp.example.com`    |
| `SMTP_PORT`   | Port (587 STARTTLS, 465 SSL) | `587`                 |
| `SMTP_SECURE` | `true` für direktes TLS      | `false`               |
| `SMTP_USER`   | SMTP-Benutzername            | `noreply@example.com` |
| `SMTP_PASS`   | SMTP-Passwort oder App-Token | `••••••`              |
| `SMTP_FROM`   | Absender-Adresse             | `noreply@example.com` |
| `SMTP_TO`     | Empfänger der Kontakt-Mails  | `mail@example.com`    |

Eine Vorlage findest du in `.env.example`.

### Design-Tokens

Liegen als CSS-Variablen in `app/assets/css/global.css`:

- `--color-bg`, `--color-text`, `--color-text-muted`, `--color-border`,
  `--color-surface`
- `--color-technobotanica` (Akzentfarbe `#03ffd0`)
- `--font-mono` (JetBrains Mono)
- `--space-*`, `--text-*`, `--max-width`

Im Dark Mode (`html.dark`) werden Hintergrund-, Text- und Border-Tokens
überschrieben — der Akzentton bleibt gleich.

## Deployment

### Docker

```bash
docker build -t portfolio-v7 .
docker run -p 3000:3000 \
  -e SMTP_HOST=... \
  -e SMTP_PORT=587 \
  -e SMTP_USER=... \
  -e SMTP_PASS=... \
  -e SMTP_FROM=... \
  -e SMTP_TO=... \
  portfolio-v7
```

Test
