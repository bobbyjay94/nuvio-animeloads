# Onyx Merge v44 — 2026.11.06.06

## Mehrfaches Sortieren von Kategorien

- In der Kategorien-Mehrfachauswahl erscheinen Aktionen zum gemeinsamen Verschieben nach oben/unten sowie zum Anfang/Ende.
- Nicht zusammenhängende Markierungen können über **Untereinander anordnen** zu einem Block gruppiert werden. Die bestehende relative Reihenfolge der ausgewählten Kategorien bleibt erhalten. Die Positionsaktionen bleiben für eine verteilte Auswahl deaktiviert, bis sie als Block gruppiert ist.
- Anschließend verschieben die Positionsaktionen den gesamten markierten Block, ohne die markierten Kategorien auseinanderzureißen.
- Markierte Kategorien können außerdem gemeinsam per Drag & Drop bewegt werden. Beim Ziehen auf eine andere Kategorie wird der Block an deren Position eingefügt.
- Die Sortierung wird über die bestehende Kategorien-Curation gespeichert. Erfolgreiche Gruppierungs- und Randverschiebungen bieten Rückgängig.
- Die Änderung sortiert ausschließlich Editor-Kategorien und löst keine Anfragen an Anbieter aus.

## Bedienung

1. Im Editor links zwei oder mehr Kategorien über Checkboxen, Strg-/Cmd-Klick oder Shift-Klick markieren.
2. Für Lücken in der Auswahl **Untereinander anordnen** wählen.
3. Mit ↑/↓ eine Position oder mit ⤒/⤓ an den Anfang/das Ende verschieben. Alternativ eine ausgewählte Kategorie ziehen, um den markierten Block gemeinsam zu bewegen.

## Prüfungen

- Python-Kompilierung, bestehende Unit-Tests und 42 Selftests.
- JavaScript-Syntaxprüfung von `admin.html`.
- Manuelle Algorithmusprüfungen für nicht zusammenhängende Auswahl, Gruppenbildung, schrittweises Hoch-/Runterschieben und Grenzen.

## Bereitstellung

Dieses Archiv ist eine lokale Release-Vorbereitung. Ein Update auf dem VPS ist damit nicht erfolgt.
