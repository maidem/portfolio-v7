---
title: TYPO3 vs. Storyblok, wann passt welches System?
slug: typo3-vs-storyblok
date: 2026-04-30
description: Zwei CMS-Welten, ein Anwendungsfall. Wann TYPO3 die richtige Wahl ist und wann Storyblok die Nase vorn hat. Aus der Sicht von jemandem, der seit 2009 mit beiden arbeitet.
tags:
  - TYPO3
  - Storyblok
  - Headless
  - CMS
---

Die Frage „TYPO3 oder Storyblok?" bekomme ich in Pitches und Workshops immer öfter. Beide Systeme sind ausgereift, beide haben treue Communities, und beide werden gerne in Vergleichsmatrizen gegeneinander ausgespielt. Mein Take nach vielen Jahren mit TYPO3 und mittlerweile einigen Storyblok-Projekten: Es ist die falsche Frage. Die richtige lautet: **Was ist dein Projekt eigentlich?**

## Wo TYPO3 immer noch unschlagbar ist

TYPO3 ist ein klassisches PHP-Monolith-CMS. Backend, Datenbank, Templating und Auslieferung leben unter einem Dach. Klingt nach 2010, ist es im Kern auch. Genau das ist seine Stärke.

Wenn ich ein Projekt sehe mit:

- **vielen Sprachen** (acht, zwölf, sechzehn, egal),
- **komplexer Redaktionshierarchie** (Workspaces, Frontend-User-Gruppen, Permissions auf Seiten- und Feldebene),
- **strengen Compliance-Anforderungen** (Hosting in Deutschland, BSI-Grundschutz, BITV-Barrierefreiheit),
- **Integration in eine bestehende IT-Landschaft** (LDAP, SAP, individuelle Solr-Indizes),

dann ist TYPO3 nach wie vor die ehrlichste Antwort. Das System ist nicht hübsch, aber es ist **erwachsen**. Die Permissions-Engine, das Lokalisierungskonzept, die Workspaces. All das ist über Jahre geschliffen worden und lässt sich kaum mit einer SaaS-Lösung nachbauen, ohne dass man drei Adapter und einen Workflow-Service drumherum stricken muss.

Solche Projekte habe ich oft genug begleitet, um sagen zu können: Auf TYPO3 laufen sie über Jahre stabil, mit überschaubarem Wartungsaufwand und ohne die Abhängigkeit von einem externen Anbieter.

## Wo Storyblok glänzt

Storyblok ist headless. Das Backend ist eine SaaS-API, das Frontend baust du komplett selbst, mit Nuxt, Next.js, Astro, was auch immer. Der Visual Editor ist dabei das, was den Unterschied macht: Redakteure sehen die Seite live, klicken auf einen Block und bearbeiten ihn im Kontext. Das ist näher an „WYSIWYG, wie es immer hätte sein sollen" als alles, was klassische CMS in zwanzig Jahren produziert haben.

Storyblok wird interessant, wenn:

- die Site **schnell sein muss** (Static Site Generation oder ISR mit Nuxt/Next),
- mehrere **Frontends auf denselben Content zugreifen** (Web, App, Display, Print),
- das **Marketing-Team Tempo macht** und nicht für jeden Layout-Tweak einen Dev-Ticket aufmachen will,
- die **Build-Pipeline modern** sein soll (Vercel, Netlify, Cloudflare Pages),
- es ein **klassisches Content-Marketing-Setup** ist (Landingpages, Kampagnen, Blog).

Das letzte Argument unterschätzen viele. Storyblok ist nicht nur „schnelles Frontend", es ist auch eine andere Art zu arbeiten. Komponentenbasiert, blockorientiert, deploybar in Stunden statt Tagen. Wenn du eine neue Landingpage brauchst, baust du sie aus vorhandenen Bloks zusammen. Niemand wartet auf einen Release.

## Wo beide schwächeln

**TYPO3** wird unangenehm, sobald du moderne Frontends willst. Ja, es gibt EXT:headless und ja, das funktioniert. Aber du arbeitest gegen die DNA des Systems. Wer TYPO3 als Headless-Backend einsetzt, hat oft das Gefühl, einen Diesel-LKW zum Sportwagen umbauen zu wollen.

**Storyblok** wird unangenehm, sobald die Anforderungen nach echtem Enterprise-Workflow rufen. Das Permission-System ist okay, aber nicht TYPO3-Niveau. Workspaces gibt es, aber nicht so granular. Und SaaS heißt: Du gibst Content-Daten an einen Drittanbieter, dessen Server in der EU stehen können, aber eben nicht müssen, je nach Plan.

## Mein Bauchgefühl als Entscheidungshilfe

Wenn ich heute angefragt werde, sortiere ich grob so:

| Projekt-Typ                                        | Mein Vorschlag                                           |
| -------------------------------------------------- | -------------------------------------------------------- |
| NGO, Behörde, Verlag, Konzern-Intranet             | TYPO3                                                    |
| Startup-Site, SaaS-Marketing, Agentur-Seite        | Storyblok                                                |
| E-Commerce-Frontend (mit Shopware/Commerce-Engine) | Storyblok                                                |
| Mehrsprachige Plattform mit ≥ 5 Sprachen           | TYPO3 (Storyblok kann es, aber TYPO3 macht es eleganter) |
| Microsite oder Landingpage-Farm                    | Storyblok                                                |
| Wiki, Handbuch, Dokumentation                      | TYPO3 oder ein Static-Site-Generator                     |

Das ist keine Wissenschaft. Manche Projekte fallen in mehrere Kategorien, und dann hilft nur reden. Aber die Tendenz stimmt.

## Fazit

TYPO3 und Storyblok sind keine Konkurrenten. Sie lösen unterschiedliche Probleme. Wer sie als Konkurrenten betrachtet, hat meistens noch nicht entschieden, **was** er eigentlich bauen will. Und das ist der einzige Punkt, an dem die Toolwahl wirklich wehtut.

Mein Rat: Erst das Ziel definieren, dann das Werkzeug. Die Reihenfolge umzudrehen, kostet am Ende mehr als jede Lizenz.
