# Onyx Merge v50 – Version 2026.11.06.12

## Neuerungen
- **Pakete im Editor laden & bearbeiten**: Bestehende Pakete können direkt aus dem Seitenmenü des Senderlisten-Editors geladen werden („📦 Paket laden …“).
- **Aktiver Paket-Modus & Status-Banner**:
  - Nach dem Laden schalten die Kategorien im Editor exakt auf den Stand des ausgewählten Pakets.
  - Ein dezentes Banner oberhalb der Kategorieliste zeigt den Namen des geladenen Pakets, die Anzahl aktiver Kategorien und Direkt-Buttons („Speichern“ & „Beenden“).
  - Auch im Seitenmenü (⋯) stehen Schnellaktionen zum Speichern und Beenden bereit.
- **Paket direkt aktualisieren**:
  - Änderungen an Kategorie-Sichtbarkeiten (Ein-/Ausblenden) können mit 1 Klick direkt in das geladene Paket zurückgespeichert werden.
  - Die Aktualisierung behält die Paket-ID und Regeln für nicht gewählte Bereiche bei.
- **Sicheres Beenden & Zurücksetzen**:
  - Beim Beenden des Paket-Modus fragt das System, ob der aktuelle Editor-Zustand beibehalten oder der Stand von vor dem Laden des Pakets wiederhergestellt werden soll.
  - Das Journal erfasst jeden Lade- und Speichervorgang mit 1-Klick-Undo.
- **Neues Paket aus IST-Zustand**:
  - „Als neues Paket speichern …“ schlägt bei geladenem Paket automatisch eine Kopie vor und ermöglicht das Anlegen neuer Vorlagen.
- **100 % passiv**: Keine zusätzlichen Anfragen an Anbieter-IPs, reine Arbeit auf bereits synchronisierten lokalen Daten.

## Verifikation
- Python-Syntaxprüfung (`py_compile`): bestanden.
- Inline-JavaScript-Syntaxprüfung (`node --check`): bestanden.
- Unit-Tests (`unit_core.py`): 87/87 bestanden (inkl. Test 36 für Paket-Laden, Aktualisieren und Fehlerbehandlung).
- Kategorie-Gruppierungstests: 5/5 bestanden.
- Selbsttests (`selftest.py`): 42/42 bestanden.
- Keine externen Provider-Anfragen ausgeführt.
