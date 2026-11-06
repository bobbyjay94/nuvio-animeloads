# Onyx Merge v39 — Paket G und H

## Paket G: Multi-Provider Stream-Matrix
- Zeigt eindeutige A/B-Paare aus bereits geladenen Live-TV-Katalogen.
- Verknüpfen, bevorzugten Anbieter festlegen und Verknüpfungen wieder trennen.
- Der öffentliche Sender-Link bleibt stabil; Onyx Merge leitet zum gewählten Anbieter und dessen Stream-ID weiter.
- Failover greift nur, wenn der bevorzugte Anbieter im bereits vorhandenen Onyx-Anfragen-Wächter pausiert ist oder der Kunde für diesen Anbieter keine Zugangsdaten hat und für den Partner schon. Es werden keine Verfügbarkeits-Pings oder zusätzlichen Anbieter-Aufrufe erzeugt.
- Mehrdeutige Namensmatches werden nicht automatisch verknüpft.

## Paket H: Sync-Shield
- Manuelle Kuration bleibt in der bestehenden persistenten curation.json über Katalog-Rescans erhalten.
- Wenn ein manuell kuratierter Sender eine genau eindeutige normalisierte Entsprechung beim anderen Anbieter hat, übernimmt Sync-Shield Name, Kategorie, Ausblendung, Logo, EPG-Zuordnung und Reihenfolge auf die neue Variante.
- Unklare oder doppelte Treffer werden ausgelassen.
- Admin-Ansicht zeigt gepflegte Einträge, bereits verknüpfte Katalogeinträge, neue/ungeprüfte Einträge und aktive Regeln.
- Keine zusätzlichen Anfragen an Anbieter-IPs.

## Validierung
- Python-Syntaxprüfung: bestanden.
- Unit-Suite: alle Prüfungen bestanden.
- System-Selbsttests: 42 bestanden, 0 fehlgeschlagen.
- JavaScript-Syntaxprüfung: bestanden.

## Einschränkungen
- Die Streaming-Architektur leitet Kunden per HTTP 302 direkt zum Anbieter weiter. Onyx Merge erhält deshalb keine Wiedergabe-Rückmeldung vom Player. Automatisches Failover bei einem tatsächlichen Stream-Fehler ohne zusätzlichen Probeaufruf ist in dieser Architektur nicht zuverlässig erkennbar; der automatische Wechsel reagiert daher nur auf den bestehenden lokalen Schutzstopp.
- Für Filme und Serien ist die Stream-Matrix nicht aktiviert; Paarung/Fallback ist auf Live-TV beschränkt.
