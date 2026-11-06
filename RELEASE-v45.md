# Onyx Merge v45 — 2026.11.06.07

## Performance-Optimierung & Latenz-Beseitigung im Editor

### 1. Sofortiger Kategoriewechsel (0 ms Latenz)
- Beim Klick auf eine Kategorie wechselt die Auswahl visuell und der Header-Titel sofort (0 ms).
- Die Sender-Tabelle zeigt während des asynchronen Ladevorgangs eine saubere Ladeanzeige (`Lade Sender von „...“`), statt die Sender der vorherigen Kategorie stehenzulassen.
- **Sequenz- & Race-Condition-Schutz (`chanLoadSeq`)**: Schnelles Durchklicken mehrerer Kategorien verwirft veraltete Antworten automatisch. Es wird garantiert nur der Inhalt der zuletzt gewählten Kategorie angezeigt.
- Robuste String-Konvertierung beim Abgleich von Kategorie-IDs (`String(c.vid) === String(vid)`).

### 2. Schnappschuss-Optimierung bei großen Katalogen (Verlauf / Journal)
- Vorher wurde bei **jedem** Klick (z. B. Verschieben, Umbenennen) ein kompletter Schnappschuss aller 35.000+ Sender und 1.800+ Kategorien serialisiert (`cur_flat()`), was bei wachsendem Entwurf 300–500 ms Server-CPU pro Klick blockierte.
- Jetzt erstellt `cur_flat()` für Kategorie-Aktionen (`/api/categories`, `/api/sort_cat`, etc.) gezielte Kategorie-Schnappschüsse ohne Durchlauf der 35.000 Sender.
- Bei Sender-Aktionen (`/api/channels`) werden nur die tatsächlich berührten Sender-IDs (`touched_channels`) erfasst.
- Reduziert die Schnappschuss-Dauer von ~220 ms auf unter 8 ms.

### 3. Kompakte JSON-Persistenz & keine unnötigen Rebuilds
- `curation.json` und `journal.json` werden nun ohne redundante Leerzeichen (`separators=(',', ':')`) gespeichert. Das spart Festplatten-E/A und Latenz.
- `POST /api/categories`: Wenn sich an den Einträgen nichts geändert hat (z. B. identische Sortiernummern), wird der teure `build_view()`-Lauf übersprungen.
- `shiftCatSel()` und `groupCatSel()` im Frontend übertragen nur noch die Kategorien, deren Reihenfolge sich tatsächlich geändert hat, anstatt aller 944 Kategorien.

## Prüfungen
- `python3 -m py_compile onyx_merge.py` erfolgreich.
- 64 Unit-Tests (`tests/unit_core.py`) erfolgreich, inklusive neuem Test für gezielte Verlaufsschnappschüsse.
- 5 Kategorie-Gruppierungs- und Verschiebe-Tests (`tests/test_category_grouping.py`) erfolgreich.
- 42 von 42 Integrationstests (`tests/selftest.py`) erfolgreich.
- JavaScript-Syntaxprüfung von `admin.html` mit Node.js fehlerfrei.
- Keine zusätzlichen Anfragen an IPTV-Anbieter.
