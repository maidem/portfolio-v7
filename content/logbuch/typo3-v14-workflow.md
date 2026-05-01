---
title: Mein TYPO3-Workflow 2026, vite, Content Blocks und DDEV bei Mittwald
slug: typo3-v14-workflow
date: 2026-04-30
description: Wie ich heute TYPO3-Projekte baue. Mit v14 LTS, dem Vite Asset Collector von Simon Praetorius, Content Blocks, SCSS, DDEV lokal, GitHub Actions im CI und Mittwald als Docker-Host. Ein Setup, das endlich Spaß macht.
tags:
  - TYPO3
  - DDEV
  - Vite
  - Content Blocks
  - Mittwald
  - GitHub Actions
---

TYPO3 hatte lange einen Ruf als „funktioniert, aber macht keinen Spaß". Mit v14 LTS, dem Vite Asset Collector von Simon Praetorius, den Content Blocks und einem sauberen DDEV-zu-Mittwald-Deployment hat sich das für mich grundlegend geändert. Ich beschreibe hier den Stack, mit dem ich aktuell arbeite, und warum die einzelnen Teile so gut zusammenspielen.

## Lokal: DDEV statt MAMP-Bastelkram

Jedes neue Projekt startet bei mir mit `ddev config` und `ddev start`. Punkt. Keine PHP-Versions-Verwaltung von Hand, keine MySQL-Sockets im Terminal, kein „bei mir läufts halt anders". DDEV liefert eine reproduzierbare Umgebung in Docker, identisch auf macOS, Linux und Windows. Ein `.ddev/config.yaml` im Repo reicht, damit das ganze Team in zehn Minuten läuft.

Der entscheidende Punkt: DDEV macht Vite und Node.js zu echten First-Class-Tools. Über `ddev npm` läuft alles im Container, der Vite-Dev-Server bekommt automatisch ein eigenes HTTPS-Zertifikat und einen Hostnamen. Kein Frickeln mit Ports, kein „funktioniert nur in Chrome".

## Frontend: vite-asset-collector + SCSS

Der Vite Asset Collector von Simon Praetorius (`praetorius/vite-asset-collector`) ist für mich die wichtigste TYPO3-Extension der letzten Jahre. Sie macht genau eine Sache, und das richtig gut: Sie verbindet TYPO3s Asset-Pipeline mit dem modernen Vite-Bundler.

Statt klassischer TypoScript-Verkettung schreibe ich im Fluid einfach:

```html
<vite:asset entry="EXT:my_sitepackage/Resources/Private/Frontend/main.ts" />
```

Im Dev-Modus liefert Vite die Assets per HMR aus, im Production-Build landen sie als gehashte Dateien im `public/_assets/`. SCSS wird über das `vite-plugin-typo3`-Setup ganz normal kompiliert, mit Sourcemaps, mit `@use`-Imports, ohne TYPO3-Magie. Endlich kann ich SCSS schreiben wie in jedem anderen Frontend-Projekt.

Das spart pro Projekt zwei bis drei Stunden Setup-Zeit, und es ist robust. Updates auf neuere Vite-Versionen brechen nichts, weil die Extension nur das Manifest liest.

## Content: Content Blocks statt Mask oder DCE

Mit Content Blocks (offiziell unter friendsoftypo3 gepflegt) deklariere ich neue Inhaltselemente als YAML plus Fluid plus optional SCSS, alles in einem Verzeichnis pro Block. Beispiel:

```
ContentBlocks/
  ├── ContentElements/
  │   ├── hero/
  │   │   ├── config.yaml
  │   │   ├── frontend.html
  │   │   ├── icon.svg
  │   │   └── assets/hero.scss
  │   └── teaser-grid/
  │       ├── config.yaml
  │       └── frontend.html
```

Keine TCA-Ungetümer mehr, keine `tt_content`-Hacks, keine doppelte Pflege zwischen Backend-Maske und Frontend-Template. Wer einen neuen Block braucht, legt einen Ordner an und bekommt sofort ein eigenes Backend-Icon, eine eigene Maske und ein eigenes Template. Die SCSS-Datei wird über den Vite-Entrypoint mit eingesammelt, dadurch ist jeder Block CSS-mäßig eigenständig.

Für Redakteure ist das Gold wert: Statt zwischen „Text mit Bild rechts" und „Text mit Bild links" auswählen zu müssen, gibt es einen sauber benannten Block pro Use-Case. Mit Vorschau-Bild, mit erklärendem Label, ohne Stress.

## Dockerfile: das ausführbare Lastenheft

Im Repo liegt von Anfang an ein `Dockerfile`. Es beschreibt exakt, was später in Production läuft, und genau dasselbe Image nutzt DDEV lokal als Basis. Multi-Stage, damit das finale Image klein bleibt:

```dockerfile
# Stage 1: Frontend mit Vite bauen
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json vite.config.ts ./
COPY packages/ packages/
RUN npm ci && npm run build

# Stage 2: PHP-Dependencies
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --optimize-autoloader

# Stage 3: Runtime
FROM php:8.3-fpm-alpine
WORKDIR /var/www/html
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/_assets ./public/_assets
COPY . .
```

Was lokal funktioniert, funktioniert auch live. Kein „auf dem Server fehlt halt eine PHP-Extension".

## CI: GitHub Actions baut und pusht das Image

Auf jeden Push in `main` startet eine Pipeline in GitHub Actions, die in genau dieser Reihenfolge arbeitet:

1. **Lint und Tests** zuerst, sonst gibt es kein Image (PHP-CS-Fixer, PHPStan Level 8, TYPO3-Unit-Tests).
2. **Docker-Build** über `docker/build-push-action`. Im Frontend-Stage läuft der Vite-Build, der Asset Collector erzeugt sein Manifest, die fertigen Assets wandern ins Image.
3. **Push in die GitHub Container Registry** (`ghcr.io/<org>/<projekt>:sha-<git-sha>` plus `:latest`).
4. **Deploy-Trigger an Mittwald**, der das neue Image im dortigen Container ausrollt.

Der Vorteil: Der Build passiert genau einmal, in einer sauberen Umgebung. Was die Registry verlässt, ist Bit für Bit das, was auf Production landet.

## Hosting: Mittwald als Container-Host

Mittwald bietet ein Container-Hosting-Produkt, mit dem ich Docker-Images aus einer Registry direkt deployen kann, ohne einen eigenen Kubernetes-Cluster zu betreiben. Im mStudio lege ich den Container einmalig an, hinterlege die Image-URL aus ghcr.io plus Pull-Secret, das war es.

Der Deploy aus GitHub Actions ist dann nur noch ein Aufruf des offiziellen `mw`-CLIs:

```yaml
- name: Deploy to Mittwald
  run: |
    mw container restart \
      --container-id $MW_CONTAINER_ID \
      --image ghcr.io/${{ github.repository }}:sha-${{ github.sha }}
```

Mittwald zieht das neue Image, startet den Container neu, und die Datenbank-Migrationen laufen als `postStart`-Hook (`vendor/bin/typo3 database:updateschema`, `vendor/bin/typo3 cache:flush`). Keine SSH-Skripte, keine FTP-Sync-Race-Conditions, kein Frontend, das schon live ist, während das Backend noch alte Klassen lädt.

Was ich an Mittwald besonders schätze: Die Server stehen in Deutschland, der Support antwortet auf Deutsch und versteht TYPO3. Für Kunden im NGO- und Verlagsbereich ist das oft der einzig akzeptable Weg, weil die DSGVO-Diskussion damit erledigt ist, bevor sie anfängt.

## Warum diese Kombination wirklich gut ist

Drei Gründe, warum dieser Stack für mich funktioniert:

**Erstens, alles ist Code.** DDEV-Config, Vite-Config, Content-Blocks, GitHub-Actions, alles liegt im Repo. Wenn ich in zwei Jahren wiederkomme, brauche ich keinen Notion-Eintrag „so haben wir das damals deployed".

**Zweitens, jedes Tool macht eine Sache richtig.** DDEV ist Container-Orchestrierung, Vite ist Bundler, Content Blocks ist Editor-UX, GitHub Actions ist CI, Mittwald ist Host. Keine Überschneidungen, keine Reibung.

**Drittens, der Workflow skaliert.** Das gleiche Setup läuft für eine 50-Seiten-Vereinsseite genauso wie für eine Konzern-Plattform mit zehn Sprachen. Ich passe nur die Komplexität der Content Blocks an, der Rest bleibt gleich.

TYPO3 v14 ist erwachsen geworden, und das Ökosystem drumherum endlich auch. Für mich ist das aktuell der entspannteste Weg, Webprojekte zu bauen, bei denen Redakteure und Entwickler gleichermaßen glücklich sind.
