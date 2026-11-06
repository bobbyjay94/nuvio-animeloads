# Onyx Merge v47 — 2026.11.06.09

## Smarters Pro Trenner-Support & Granulare Namen-Bereinigung

### 1. Echter Platzhalter-Videostream für Smarters Pro & IPTV-Apps
- **Problem gelöst**: Player wie IPTV Smarters Pro blenden Live-TV-Kategorien automatisch aus, wenn die Xtream Codes API (`get_live_streams`) 0 Sender für diese Kategorie zurückliefert. Reine Trennzeilen und leere selbsterstellte Kategorien (wie `--- KABEL & PAY-TV ---`) wurden dadurch in Smarters trotz Aktivierung nicht dargestellt.
- **Lösung mit deinem Clip**: Für jede leere sichtbare Live-Kategorie erzeugt Onyx Merge automatisch einen virtuellen Platzhalter-Sender mit dem Namen der Kategorie.
- **100 % lokales Video-Streaming**: Klickt ein Kunde in Smarters auf den Sender, streamt der Server direkt deinen hochgeladenen 10-Sekunden-Clip `onyx_tv_volumetric_reveal.mp4` (1080p Full HD) über HTTP 206 Partial Content (Range Requests).
- **Zero-Polling / IP-Schutz**: Keine Weiterleitung, keine Anfrage an Anbieter A oder B. Das Video wird vollständig lokal vom Server ausgeliefert.
- **Admin-Steuerung unter Betrieb**: Der Clip kann im Admin-Panel unter *Betrieb* angesehen, per Schalter ein-/ausgeschaltet oder durch ein anderes MP4-Video ersetzt werden.

### 2. Granulare Namen-Säuberung mit Checkboxen
- **Gezielte Auswahl**: Der Säubern-Dialog im Editor bietet nun individuelle Checkboxen:
  - **Länderkürzel löschen**: Entfernt Präfixe wie `DE:`, `DE |`, `[DE]`, `TR -` etc. (sowohl am Anfang als auch in Klammern).
  - **Sonderzeichen & Hochzahlen löschen**: Entfernt `⁴ᴷ`, `³⁸⁴⁰ᴾ`, `★`, `⚽`, `🔴`, `💎`, `┃`, `▎` etc.
  - **Werbewörter löschen**: Entfernt `VIP`, `PREMIUM`, `PLATINUM`, `GOLD` etc.
  - **Qualität komplett löschen**: Entfernt `FHD`, `4K`, `UHD`, `HD`, `SD`, FPS und Codec-Tags komplett aus dem Namen.
  - **Qualität vereinheitlichen**: Bringt die Qualität (4K, FHD, HD) sauber und einheitlich an das Namensende (deaktiviert, wenn „Qualität löschen“ gewählt ist).
- **Live-Vorschau vor dem Übernehmen**: Jede Änderung an den Checkboxen aktualisiert sofort die Live-Vorschau mit realen Vorher/Nachher-Beispielen aus der Liste.
- **Vollständiger Verlauf mit Undo**: Wie gewohnt kann jede Säuberungsaktion mit einem Klick über das Journal rückgängig gemacht werden.

### 3. Editor-Rückmeldung bei leeren Kategorien
- Im Editor wird bei leeren Kategorien direkt vermerkt: *„Für IPTV-Apps (wie Smarters Pro) wird automatisch dein Platzhalter-Clip als Stream hinterlegt, damit dieser Trennordner sichtbar bleibt.“*

## Prüfungen & Qualität
- `python3 -m py_compile onyx_merge.py` fehlerfrei.
- 70 von 70 Unit-Tests (`tests/unit_core.py`) bestanden (inkl. aller Säuberungsoptionen, Platzhalter-Stream-Generierung und HTTP 206 Video-Range-Streaming).
- 5 von 5 Gruppierungs- und Verschiebe-Tests (`tests/test_category_grouping.py`) bestanden.
- 42 von 42 Integrationstests (`tests/selftest.py`) bestanden.
- JavaScript-Syntaxcheck von `admin.html` fehlerfrei.
- Null zusätzliche Anfragen an IPTV-Anbieter-Server.
