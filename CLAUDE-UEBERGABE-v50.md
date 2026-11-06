# Claude-Übergabedokumentation: Onyx Merge v50 (2026.11.06.12)

## 1. Kontext & Ausgangslage
- Emre bat darum, bestehende Pakete direkt im Senderlisten-Editor laden, anpassen und wieder im selben Paket speichern zu können.
- Bisher gab es nur das Anlegen neuer Pakete aus dem aktuellen IST-Zustand (v37/v38) oder das Bearbeiten von Regeln im separaten Paket-Tab.

## 2. Technische Umsetzung
- **Backend (`onyx_merge.py`)**:
  - `POST /api/package_load_to_state`: Ermittelt Paket-Mitglieder via `compute_packages(view)`, setzt `curation[kind][vid]['show']` für alle Kategorien entsprechend und baut die Ansicht neu.
  - `POST /api/package_from_state`: Unterstützt nun optional `id`. Wenn `id` angegeben ist, wird das bestehende Paket in-place aktualisiert (`is_update = True`). Bestehende Includes/Excludes anderer Bereiche bleiben unberührt.
  - Beide Endpunkte sind im Journal registriert (`CAT_JOURNAL_PATHS`, `JOURNAL_PATHS`) und ermöglichen 1-Klick-Undo.
- **Frontend (`admin.html`)**:
  - Menüpunkt „📦 Paket laden …“ öffnet Auswahldialog mit Übersicht aller Pakete (inkl. Kategorieanzahl je Bereich und Benutzeranzahl) und Bereichsauswahl (Live, VOD, Serien).
  - Statusbanner `#pkgbanner` im Editor zeigt aktiven Paketnamen und Metadaten sowie Direkt-Buttons „💾 Speichern“ und „✕ Beenden“.
  - Menüpunkte „💾 Paket ‚...‘ speichern“ und „✕ Paket-Modus beenden“.
  - Sicheres Beenden: Optionaler Rollback auf den Zustand von vor dem Laden des Pakets.
- **Tests**:
  - Test 36 in `tests/unit_core.py` verifiziert das Laden, Setzen von `show`, Aktualisieren bestehender Pakete und Fehlerbehandlung bei ungültigen IDs.

## 3. Testergebnisse
- `py_compile`: OK
- `node --check`: OK
- `unit_core.py`: 87/87 OK
- `test_category_grouping.py`: 5/5 OK
- `selftest.py`: 42/42 OK

## 4. Wichtige Sicherheitsregeln
- Keine zusätzlichen Anfragen an Anbieter-IPs.
- Keine automatischen VPS-Änderungen ohne Freigabe durch Emre.
