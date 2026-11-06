# Release Notes Onyx Merge v48 (Version 2026.11.06.10)

## Highlights
- **Vollständige Präfix- & Suffix-Tag-Bereinigung**: Zusammengesetzte Metadaten-Präfixe wie `4K-TR-HDR - Filmname (2026)` werden bei ausgewählten Bereinigungsoptionen restlos zu `Filmname (2026)` bereinigt. Keine stehenbleibenden Bindestriche oder Länderkürzel wie `-TR- -` mehr.
- **Erweiterte Erkennung von Länderkürzeln**:
  - Delimited Tags: Erkennt Länderkürzel auch inmitten von Bindestrichen (`-TR-`), Unterstrichen (`_TR_`), Pipes (`|TR|`) oder Schrägstrichen (`/TR/`).
  - Suffix-Kürzel: Bereinigt Länderkürzel am Ende des Titels (z. B. `Film (2026) - TR`, `Film (2026) [TR]`, `Film (2026) (TR)` oder `Film (2026) TR`).
- **Intelligente Randzeichen-Säuberung**: Entfernt verbliebene Trennzeichen an Anfang und Ende (`clean_edges`), sodass nach dem Entfernen von Qualitäts- und Ländertags keine verwaisten `-`, `|` oder `:` stehenbleiben.
- **Kollisionsschutz für Filmtitel**: Normale Wörter wie `ALICE IN WONDERLAND`, `NO COUNTRY FOR OLD MEN` oder `IT (2017)` werden durch strikte Trennzeichen-Prüfungen und Namens-Schutzmechanismen nicht beschädigt.
- **Enthält alle v47-Features**: Smarters-Platzhaltervideo (`onyx_tv_volumetric_reveal.mp4`) für leere selbsterstellte Kategorien und granulare Checkboxen im Cleaner-Dialog.

## Test- & Qualitätsstatus
- `tests/unit_core.py`: 73/73 Tests bestanden (inkl. 4K-TR-HDR und Suffix-Tests)
- `tests/test_category_grouping.py`: 5/5 Gruppierungstests bestanden
- `tests/selftest.py`: 42/42 Selbsttests bestanden
- JavaScript-Syntaxcheck: bestanden
- **0 externe Provider-Anfragen** (rein lokale Verarbeitung des Katalogs)
