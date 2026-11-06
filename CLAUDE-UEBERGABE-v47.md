# Claude-Übergabebericht: Onyx Merge v47 (2026.11.06.09)

## Kontext für Claude
- **Projekt**: Onyx Merge (Eigenständiges IPTV-Admin-, Merger- und Editor-Master-Panel auf Python-/HTML-Basis für Emre).
- **Server**: Ubuntu VPS (`51.38.64.30:48221`), Pfad `/opt/onyx-merge`, Admin-Listener `127.0.0.1:8091` (erreichbar über Tailscale `http://onyx-vps:8091` bzw. `http://100.91.21.21:8091`).
- **Anbieter-Schutz**: Höchste Priorität: Keine zusätzlichen Anfragen an IPTV-Anbieter senden, um IP-Sperren zu verhindern.

## Neu in v47
1. **Platzhalter-Videostream für Smarters Pro**:
   - `onyx_tv_volumetric_reveal.mp4` (10s, 1080p, H.264/AAC, moov faststart) liegt gebündelt unter `ui/placeholder.mp4`.
   - `list_items()` generiert für sichtbare leere Live-Kategorien (Trenner / selbsterstellte Kategorien) automatisch einen virtuellen Stream (`stream_id >= 2_100_000_000`).
   - Smarters Pro erhält in `get_live_streams` somit 1 Item und zeigt die Kategorie-Ordner dauerhaft an.
   - `play()` erkennt `vid >= 2_100_000_000` und ruft `serve_placeholder_video()` auf.
   - `serve_placeholder_video()` unterstützt vollständige HTTP 206 Partial Content (Range Requests) für flüssiges Video-Streaming.
   - Admin UI unter *Betrieb* bietet Video-Vorschau, Ein/Aus-Schalter (`/api/toggle_placeholder`) und Upload-Möglichkeit (`/api/upload_placeholder`).
2. **Granulare Namen-Säuberung**:
   - `clean_item_name(name, kind, options)` unterstützt unabhängige Optionen:
     - `remove_cc`: Länderkürzel am Anfang und in Klammern entfernen.
     - `remove_special`: Symbole, Emojis, Deko und Hochzahlen (`⁴ᴷ`, `³⁸⁴⁰ᴾ`) entfernen.
     - `remove_vip`: Werbebegriffe (VIP, Premium) entfernen.
     - `remove_quality`: Qualitätsmerkmale komplett entfernen.
     - `normalize_quality`: Qualität sauber ans Namensende stellen.
   - `admin.html` bietet interaktiven Dialog mit 5 Checkboxen und sofortiger Live-Vorschau.

## Teststatus
- 70/70 Unit-Tests bestanden.
- 5/5 Gruppierungstests bestanden.
- 42/42 Selftests bestanden.
- Node.js JS-Syntaxcheck bestanden.
- Keine Anbieter-Anfragen.
