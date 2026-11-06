# Onyx Merge v49 – Version 2026.11.06.11

## Änderungen
- Freie Failover-Partnerwahl zwischen bereits geladenen Live-TV-Kanälen: gleiche Quelle (A→A oder B→B) sowie quellenübergreifend (A↔B).
- Failover-Auswahl bietet einen Quellenfilter „Alle“, „Anbieter A“ und „Anbieter B“; jeder Treffer trägt Quelle und Anbieterkennzeichnung.
- Paar-Datensatz speichert Primär- und Backup-Kanal-ID, Anbieter-ID, Quell-ID und Namen explizit. Vorhandene A/B-Datensätze bleiben lesbar.
- Rollenanzeige, Rollentausch, Trennen und Stream-Matrix berücksichtigen nun die tatsächliche Quelle beider Kanäle.
- Partnersuche nutzt ausschließlich bereits geladene lokale Katalogdaten. Es wurden keine zusätzlichen Anfragen an Anbieter-IPs, keine Provider-Probes und kein Stream-Relay hinzugefügt.

## Wichtige technische Grenze
Onyx Merge leitet Streams per HTTP 302 direkt an den Anbieter weiter. Es sieht daher weder Videobild noch Player-Fehler. Die vorhandene Reconnect-Heuristik und lokale Schutzstopps können keinen tatsächlichen schwarzen Bildschirm, Ruckler oder Verbindungsfehler zuverlässig erkennen. v49 verbessert die manuelle Zuordnung und erhält das bestehende heuristische Failover; es verspricht keine sichere Erkennung realer Wiedergabefehler und kein „perfektes“ automatisches Failover.

## Verifikation
- Python-Syntaxcheck (`py_compile`): bestanden.
- Unit-Tests: 82 erfolgreiche Prüfungen, 0 fehlgeschlagen.
- Kategorie-Gruppierung: 5/5.
- Selbsttests: 42/42.
- Inline-JavaScript-Syntaxcheck: bestanden.
- Keine VPS-Installation oder Live-Provider-Anfrage in diesem Lauf.
