# Claude-Übergabe – Onyx Merge v49

## Kontext und Ziel
Onyx Merge ist das eigenständige IPTV-Merger-/Editor-/Admin-Projekt, getrennt vom Onyx-TV-Player. Emre möchte freie Failover-Zuordnungen: ein Live-Kanal kann auf einen alternativen Kanal desselben Anbieters (A→A oder B→B) oder auf einen Kanal des anderen Anbieters (A↔B) verweisen. Er legt großen Wert darauf, die Anbieter-IP nicht mit unnötigen oder häufigen Anfragen zu belasten, da IP-Sperren bereits vorgekommen sind.

## Implementiert in v49 (2026.11.06.11)
- Backend-Linkmodell um explizite `primary_vid`, `backup_vid`, `primary_pkey`, `backup_pkey`, Quell-IDs, Namen und `intra_provider` erweitert; alte A/B-Datensätze werden weiterhin gelesen.
- `/api/stream_failover_partner` durchsucht vorhandene lokale Live-Katalogdaten, lässt nach Anbieter A/B/Alle filtern und schließt den gewählten Sender selbst aus.
- `/api/stream_link` erlaubt Verknüpfung zweier verschiedener IDs desselben Anbieters oder verschiedener Anbieter; Selbstverknüpfung bleibt abgelehnt.
- Streamauflösung, Rollenwechsel, Trennen, `/api/channels` und Stream-Matrix nutzen die expliziten IDs und Anbieterkennungen.
- Failover-Dialog zeigt Anbieterauswahl und Tests per vorhandenem Browser-Player; keine serverseitige Probe.
- Bestehende A/B-Links bleiben rückwärtskompatibel.
- Keine zusätzlichen Anfragen an Provider-IPs; keine Stream-Relay-Änderung.

## Architekturgrenze unbedingt beachten
Der aktuelle Streamweg ist HTTP 302 direkt zum Anbieter. Onyx Merge erhält keine Player-Telemetrie und sieht keine Videodaten. Deshalb kann es Schwarzbild, wiederholtes Ruckeln oder echten Wiedergabeausfall nicht zuverlässig feststellen. Der vorhandene Reconnect-Mechanismus ist nur eine Heuristik; ein lokaler Schutzstopp ist die einzige harte lokale Bedingung. Keine Release-Notiz oder Produktbeschreibung soll v49 als zuverlässige Schwarzbild-Erkennung oder perfektes automatisches Failover darstellen.

## Abgrenzung / noch nicht gelöst
Das Modell speichert je Kanalpaar genau einen Primär- und einen Backup-Kanal. Es implementiert keine priorisierte Kette aus mehreren Alternativen (zuerst weitere Streams von Anbieter A, danach Anbieter B). Falls Emre eine mehrstufige Failover-Kette möchte, muss dafür eine eigene Datenmodell-/UI-Erweiterung mit klarer Reihenfolge geplant und getestet werden. Auch echte Wiedergabefehler bleiben ohne sichere Player-Telemetrie/Relay nicht erkennbar; zusätzliche Probeaufrufe an Anbieter wurden ausdrücklich vermieden.

## Tests
- `python3 -m py_compile onyx_merge.py`: bestanden.
- `python3 tests/unit_core.py`: 82 Prüfungen, 0 fehlgeschlagen.
- `python3 tests/test_category_grouping.py`: 5/5 bestanden.
- `python3 tests/selftest.py`: 42/42 bestanden.
- Inline-JavaScript aus `admin.html` extrahiert und mit `node --check` geprüft: bestanden.

## VPS / Release-Status
Der Code wurde lokal aktualisiert und geprüft. VPS-Update wurde nicht ausgeführt und darf nicht als installiert oder live bestätigt beschrieben werden. Vor dem Update zuerst ein Backup erstellen und die übliche Onyx-Update-Prozedur verwenden.
