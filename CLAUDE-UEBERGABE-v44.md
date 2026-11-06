# Onyx Merge — Claude-Übergabe v44

## Umfang dieser Version

Onyx Merge ist das separate Admin-/Merger-/Editor-Projekt. v44 ergänzt nur die Sortierung der Kategorien im Editor.

### Nutzerwunsch

Wenn mehrere Kategorien ausgewählt sind, sollen sie zusammen nach oben oder unten bewegt werden können. Nicht zusammenhängend markierte Kategorien sollen über einen eigenen Button untereinander angeordnet werden, damit sie danach gemeinsam bewegt werden können.

### Umsetzung

- `admin.html` erweitert die Mehrfachauswahl-Werkzeugleiste um „Untereinander anordnen“, ↑, ↓, Anfang und Ende.
- Gruppenbildung erhält die aktuelle Reihenfolge der ausgewählten Kategorien und bündelt sie ab dem bisherigen ersten ausgewählten Index. Positionsbuttons sind für eine nicht zusammenhängende Mehrfachauswahl deaktiviert und geben zusätzlich einen verständlichen Hinweis, bis sie gruppiert wurde.
- Schrittweises Verschieben bewegt die markierten Kategorien als Block über unmittelbar benachbarte nicht markierte Kategorien.
- Anfang/Ende bewegt den gesamten ausgewählten Block.
- Drag & Drop startet bei einer markierten Kategorie den ganzen Mehrfachauswahl-Block; Ziehen auf eine andere Kategorie fügt den Block an deren Position ein.
- Änderungen werden über die bestehende `POST /api/categories`-Route (`order`) gespeichert. Keine Provider-Kataloge werden abgefragt.
- Gruppierung sowie Verschieben an Anfang/Ende bieten Undo. Tastaturkürzel Alt+↑/↓ und Alt+Pos1/Ende greifen auf die Kategorieauswahl zurück, wenn keine Senderauswahl aktiv ist.

## Dateien

- `admin.html`: Mehrfach-Kategorieaktionen, Group-/Shift-Algorithmen und Mehrfach-Drag.
- `onyx_merge.py`: Versionsnummer und Changelog auf `2026.11.06.06`.
- `RELEASE-v44.md`: Releasebeschreibung und Bedienung.

## Tests / offene Punkte

Algorithmusfälle wurden separat simuliert. Python-Compile, vorhandene Unit-Tests, 42 Selftests und JS-Syntaxcheck sind vor dem Release auszuführen und im Release-Status zu protokollieren. Browserlaufzeit und VPS-Installation sind nicht bestätigt.

## Harte Projektregel

Provider-IP-Anfragen minimieren. Diese v44-Sortierfunktion ändert lokale Admin-Kuratierung und macht keinerlei zusätzliche Anbieteranfragen.
