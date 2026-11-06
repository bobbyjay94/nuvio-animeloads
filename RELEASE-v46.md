# Onyx Merge v46 — 2026.11.06.08

## Selbsterstellte & leere Kategorien in Vorschau und IPTV-Apps erhalten

### 1. Eigene Kategorien (z. B. Trennzeilen / neue Kategorien) bleiben sichtbar
- Selbsterstellte Kategorien (gekennzeichnet mit `[E]`, `pkey: "C"`), wie z. B. `--- KABEL & PAY-TV ---`, werden nun auch dann in der **Vorschau** und an **IPTV-Player-Apps** (TiviMate, Smarters, etc.) ausgeliefert, wenn sie noch keine Sender enthalten oder als Trennzeilen dienen.
- Solange eine Kategorie im Editor auf **„sichtbar“** geschaltet ist (`show: true`), wird sie in der berechneten Ansicht (`visible_cats`) und der Vorschau (`/api/preview`) aufgeführt.
- Wird die eigene Kategorie im Editor deaktiviert („ausgeblendet“), verschwindet sie wie gewohnt sofort aus der Vorschau und den Kundenlisten.

### 2. Gezielte Filterung: Kein Datenmüll durch leere Provider-Kataloge
- Tausende ungenutzte oder leere Kategorien aus den Roh-Katalogen der Anbieter (Anbieter A und B) bleiben weiterhin zuverlässig ausgefiltert, sodass Kundenlisten nicht mit toten Provider-Kategorien überflutet werden.
- Nur bewusst vom Administrator angelegte eigene Kategorien (`pkey == "C"`) genießen diesen Bestandschutz.

### 3. Vorschau-Detailanzeige optimiert
- Beim Anklicken einer leeren Kategorie im Tab „Vorschau“ zeigt die Hauptansicht nun den klaren Hinweis `Diese Kategorie ist leer.` (statt der missverständlichen Meldung `Hier sieht dieser Benutzer nichts.`).

## Prüfungen
- `python3 -m py_compile onyx_merge.py` fehlerfrei.
- 70 Unit-Tests (`tests/unit_core.py`) erfolgreich, inklusive gezielter Tests für leere eigene Kategorien in `visible_cats`, `/api/preview` und Xtream Codes `list_categories`.
- 5 Kategorie-Gruppierungs- und Verschiebe-Tests (`tests/test_category_grouping.py`) erfolgreich.
- 42 von 42 Integrationstests (`tests/selftest.py`) erfolgreich.
- JavaScript-Syntaxprüfung von `admin.html` mit Node.js fehlerfrei.
- Keine zusätzlichen Anfragen an IPTV-Anbieter.
