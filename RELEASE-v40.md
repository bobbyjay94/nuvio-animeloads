# Onyx Merge v40 – Release Notes (2026.11.06.02)

## High-Availability Stream Failover & Adaptive Circuit Breaker

### Die Herausforderung bei HTTP 302
In der Onyx-Merge-Architektur leitet der Server Clients per HTTP 302 direkt zum Video-Server des Anbieters weiter. Sobald die Weiterleitung erfolgt ist, fließt der Video-Traffic direkt zwischen Client und Anbieter; Onyx Merge erhält herkömmlich keine direkte Rückmeldung über spätere Stream-Abbrüche oder 404-Fehler. Dauerhaftes aktives Anfragen (Probing) der Anbieter-Server würde deine VPS-IP bei den Anbietern gefährden (Rate-Limits/Sperren).

### Die Principal-Backend-Lösung: Passive Reconnect-Erkennung & Circuit Breaker
1. **Intelligente Reconnect-Erkennung (Zero-Polling / 100% IP-Schutz):**
   - IPTV-Player (TiviMate, Smarters, VLC etc.) versuchen bei einem Stream-Abbruch fast ausnahmslos innerhalb von 0.8 bis 12 Sekunden automatisch neu zu verbinden.
   - Onyx Merge erkennt diese schnellen Wiederholungsaufrufe für denselben Sender im In-Memory-Ringpuffer thread-sicher als Fehlersignal des Players.
   - Die Verbindung wird sofort nahtlos auf den Backup-Anbieter umgeschaltet, sofern der Kunde über entsprechende Zugangsdaten verfügt.

2. **Adaptiver Stream Circuit Breaker:**
   - Kommt es auf einem Sender innerhalb von 60 Sekunden zu wiederholten Reconnects (über denselben oder mehrere Kunden), schaltet der Circuit Breaker den betroffenen Anbieter für diesen Sender temporär (120 s) auf „degraded“.
   - Alle nachfolgenden Kunden, die diesen Sender einschalten, werden **sofort und ohne Erstausfall** auf den funktionierenden Partner-Anbieter geleitet.
   - Nach Ablauf der 120 Sekunden erfolgt ein automatisches Re-Testing (Half-Open).

3. **Admin-Monitoring & Live-Transparenz:**
   - In der **Stream-Matrix** informiert eine neue Status-Kachel in Echtzeit über Umschaltungen, getrackte Streams und aktive Schutzschaltungen.
   - Ein Klick auf „Schutzschalter zurücksetzen“ ermöglicht das manuelle Aufheben aller temporären Sperren.
   - Neuer Endpunkt `GET /api/stream_failover_status` und `POST /api/stream_failover_reset`.

### Tests
- Vollständige Integrationstests: 42 von 42 bestanden.
- Alle Unit-Tests inklusive Failover-, Reconnect- und Circuit-Breaker-Szenarien: 0 fehlgeschlagen.
