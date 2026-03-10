Technische Übersicht

Plattform / Framework
Entwickelt mit Next.js (vermutlich App Router), gehostet auf Vercel – hybrides Rendering (SSG/SSR), optimierte Bilder, automatische Font-Optimierung.
React 18+ mit Client-Komponenten für interaktive Elemente (Warenkorb-Zähler, Buchungsstufen).
Styling: Tailwind CSS (Utility-First-Ansatz: flexible Layouts, responsive Breakpoints, Hover-Effekte).
UI-Bausteine: Wahrscheinlich shadcn/ui oder Radix UI kombiniert mit Lucide-react Icons – saubere, barrierefreie Komponenten.
Schriften: Elegante Serif/Sans-Kombination für luxuriöses Erscheinungsbild (Google Fonts oder custom).
Deployment: Vercel Edge Network – extrem niedrige Ladezeiten (<100 ms TTFB), globales CDN, Auto-Scaling.
Architektur
Single-Page-ähnliche Anwendung mit clientseitiger Navigation (keine vollständigen Neuladungen).
Haupt-Route / rendert Hero-Bereich, Abschnitte und interaktive Buchungs-/Warenkorb-Ebene.
State-Management: React Context, Zustand oder Jotai für Warenkorb und Buchungsfortschritt (persistent über Schritte hinweg).
Warenkorb: Rein clientseitig (localStorage oder Session), Echtzeit-Update des Zählers (🛒 0 → 🛒 n).

Kernfunktionen & Buchungsablauf
Reservierungsmodul – mehrstufiger, schrittweiser Prozess:

Luftschiff-Auswahl
Anzeige der Flotte mit 3 Luftschiffen (mit Verfügbarkeitskalender).
Filter: Datum, Route (z. B. Alpen, Rheintal), Zeitfenster (Sonnenuntergang/Abendessen).
Darstellung: Karten- oder Grid-Layout, Hover-Effekte, Kapazitätsanzeige.
Bei Auswahl: Hinzufügen einer „Reservierungsabsicht“ zum Warenkorb/Session.

Tisch- oder Exklusivbuchung
Zwei Modi:
Einzelner Tisch – Auswahl aus interaktivem Gondel-Sitzplan (2–6 Personen pro Tisch, bevorzugt Fensterplätze). Seat-Map via SVG, Canvas oder CSS-Grid.
Gesamtes Luftschiff exklusiv – Private Charter-Buchung (ganze Gondel + Crew, ideal für Events mit 20–40 Gästen). Höhere Preisklasse.

Echtzeit-Verfügbarkeit (Mock oder API-Abfrage).
Mögliche Add-ons: Weinbegleitung, Spezialmenü.

Zahlung & Bestätigung
Integrierter Checkout: Übersicht (Luftschiff + Tisch/Charter + Gäste + Preisaufstellung).
Zahlungsanbieter: Platzhalter für Stripe o. Ä. (Kartenformular, Apple Pay/Google Pay).
Warenkorb-Abschluss: Prüfen → Bezahlen → Bestätigungsseite/E-Mail-Auslösung.
Währung: € (europäisch ausgerichtet).


Warenkorb-Implementierung

Dauerhaft sichtbares Icon im Header: 🛒 [Anzahl] – aktualisiert sich live via React-State.
Klick öffnet Side-Drawer/Sheet (shadcn/ui-Style) mit:
Positionen (Luftschiff/Datum, Tisch/Charter, Gäste, Zwischensumme).
Bearbeiten/Entfernen-Optionen.
„Zur Zahlung“-Button.

Noch keine serverseitige Persistenz nötig (MVP: alles clientseitig).

Sichtbare Kennzahlen (hartcodiert / bereit für Dynamik)

3.000 m – Flughöhe
3 Schiffe – aktive Flotte
2 Michelin Sterne – kulinarische Bewertung
1923 / 2026 – Gründung / Moderne Neuauflage

UX- & Design-Details

Atmosphärisch: Subtile Scroll-Animationen, Parallax-Effekte, Farbverläufe, hochauflösende Hero-Bilder (Luftschiffe über Wolken).
Responsiv: Mobile-First mit Tailwind (gestapelte Abschnitte auf kleinen Bildschirmen, touch-freundliche Buttons).
Barrierefreiheit: Wahrscheinlich ARIA-Labels auf interaktiven Elementen, ausreichender Kontrast im Dark-Theme.
Performance: Next.js Image-Komponente (WebP/AVIF), Lazy-Loading unterhalb des Fold.






To-Do-Liste: 
UI-Überarbeitung; Abgeschlossen
Tabellen aus Datenbank verbinden: Abgeschlossen
Anmeldesystem; Ausstehend...
Allgemeine Codeüberprüfung und Neuverfilmung bestimmter Teile; Ausstehend...

Aktueller Stand / MVP-Merkmale

Keine vollständige Backend-Integration sichtbar (Mock-Daten oder lokaler State für Verfügbarkeit).
Menüs saisonal, aber noch nicht detailliert (Platzhalter-Text).
Keine Benutzerkonten/Anmeldung – Gast-Checkout-Flow.
