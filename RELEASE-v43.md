# Onyx Merge v43 – Release Notes (2026.11.06.05)

## Präzise Failover-Partnersuche & Relevanz-Ranking

### 1. Problem behoben: Falsche Sender in der Failover-Partnersuche
- **Ursache:** Im Suchalgorithmus von `/api/stream_failover_partner` bewirkte die vorherige Bereinigungslogik, dass sehr kurze Sendernamen wie `BR HD`, `HR HD` und `SR HD` auf einen leeren Basisnamen bereinigt wurden. Bei der Abfrage `c_clean in cur_clean` wertete Python den leeren String immer als `True` und vergab fälschlicherweise einen hohen Ähnlichkeitsscore (70). Dadurch wurden diese Sender selbst bei expliziter Suche nach "Bein spor" ganz oben gelistet und verdrängten die echten Suchtreffer.
- **Lösung in v43:**
  - **Strikter Suchfilter:** Wenn ein Suchbegriff eingegeben wird (z. B. "Bein spor"), werden ausschließlich Sender zurückgegeben, die alle eingegebenen Wörter im Namen oder Originalnamen enthalten. Unpassende Sender wie `BR HD` werden vollständig herausgefiltert.
  - **Intelligentes Relevanz-Ranking:** Exakte Treffer, gleiche Sendernummern (z. B. "1" bei `beIN SPORTS 1 ONYX HD` matching `BEIN SPORT 1 FHD`) und Basisnamens-Übereinstimmungen werden ganz oben priorisiert.
  - **Sichere Partnervorschläge ohne Suchbegriff:** Beim anfänglichen Öffnen des Modals werden nur Sender mit echter Namensähnlichkeit (mindestens 2 gemeinsame bedeutsame Buchstaben/Wörter) vorgeschlagen. Leere oder triviale Kürzel werden ignoriert.

### 2. Schnellere Bedienung
- **Sofortsuche:** Drücken der `Enter`-Taste führt die Suche sofort ohne Wartezeit aus.
- **Debounce:** Flüssiges Tippen mit 200 ms Verzögerung.
- **Klares Feedback:** Zeigt bei keinem Treffer den genauen Suchbegriff an.

### Tests & Verifikation
- 64/64 Unit-Tests bestanden (inkl. explizitem Test für Suche nach "Bein spor" mit Bestätigung, dass `BEIN SPORT 1 FHD` gefunden und `BR HD` ausgeschlossen wird).
- 42/42 Selftests bestanden.
- JavaScript-Syntaxprüfung für `admin.html` erfolgreich validiert.
