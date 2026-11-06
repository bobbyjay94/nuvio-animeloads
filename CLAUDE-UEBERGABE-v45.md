# Claude Übergabebericht — Onyx Merge v45 (2026.11.06.07)

## Problemstellung
Der Nutzer berichtete:
> "manchmal wechselt er die kategorie nicht das ist sehr nervig. Es dauert lange wenn eine änderung etwas gespeichert/zwischengespeichert wird ab einem bestimmten Punkt"
Screenshot zeigte ~944 Kategorien, "Nicht gespeichert (12)" und eine leere Senderansicht bei Kategorie-Auswahl.

## Root Cause Analyse
1. **Frontend Race Conditions & Ladezustand**:
   - `admin.html` führte beim Klick auf eine Kategorie `loadChans()` asynchron ohne Sequenz-Zähler aus.
   - `renderHead()` wurde erst *nach* dem Eintreffen der Serverantwort aufgerufen. Bei Verzögerung blieb der Kopf alt.
   - Traf eine frühere Anfrage verspätet nach einer neueren ein, überschrieb sie die Anzeige.
   - Bei Latenz oder kurzen Timeouts fehlte ein Error-Handling in `loadChans()`.
2. **Backend Journal Snapshot Overhead (`cur_flat`)**:
   - Vor jedem POST auf `JOURNAL_PATHS` (`do_POST`) wurde `cur_flat()` aufgerufen, das alle ~35.000 Channels und ~1.800 Kategorien vollständig als formatierte JSON-Strings serialisierte.
   - Bei jedem Speichern/Zwischenspeichern lief dies 2x (vorher & nachher), was 400-500 ms reine CPU-Zeit pro Klick kostete.
3. **Massen-Payloads bei Kategorie-Verschiebung**:
   - `shiftCatSel` und `groupCatSel` sandten jedes Mal alle 944 Kategorien über die API, was jedes Mal einen vollständigen Katalog-Rebuild auslöste.

## Umgesetzte Lösungen
1. **Frontend (`admin.html`)**:
   - Sofortige visuelle Selektion und Aktualisierung des Kategorie-Headers (`renderHead()`) bei Klick (0 ms Latenz).
   - Sender-Tabelle zeigt sofort Ladeindikator.
   - Sequenzschutz (`chanLoadSeq`) verwirft überholte Server-Antworten.
   - Fehlerbehandlung fängt Netzwerk-Abbrüche ab und bietet "Erneut versuchen"-Schaltfläche.
   - Delta-Payloads für Kategorie-Verschiebungen: Nur tatsächlich veränderte Kategorien werden an `/api/categories` übertragen.
   - Robuste String-Vergleiche bei allen Kategorie-IDs (`String(c.vid) === String(vid)`).
2. **Backend (`onyx_merge.py`)**:
   - `cur_flat(path, touched_channels)` ist nun pfadspezifisch: Kategorie-Routen erfassen nur Kategorien (7 ms statt 220 ms), Sender-Routen erfassen nur modifizierte Sender.
   - `AdminHandler.body()` puffert das geparste JSON (`_body_parsed`), verhindert Socket-Re-Reads.
   - `save_json` speichert `curation.json` und `journal.json` kompakt mit `separators=(',', ':')`.
   - `POST /api/categories` überspringt `build_view`, wenn keine Werte verändert wurden.

## Tests & Verifikation
- 64 Unit-Tests (`unit_core.py`): 0 Fehler.
- 5 Gruppierungstests: 0 Fehler.
- 42 Selftests (`selftest.py`): 42 bestanden, 0 Fehler.
- Node.js JS-Syntaxcheck: OK.
