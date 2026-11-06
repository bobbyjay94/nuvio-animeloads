# Claude Übergabebericht – Stand v48 (Version 2026.11.06.10)

## Ausgangslage
In v47 wurde die granulare Checkbox-Steuerung für den Name-Cleaner und das Smarters-Platzhaltervideo eingeführt. Im Praxistest mit echten VOD-Listen (`image-23.png`) zeigte sich jedoch, dass bei Titeln mit zusammengesetzten Tags wie `4K-TR-HDR - undertone (2026)` nach Entfernung von `4K` und `HDR` das Länderkürzel `TR` mit verwaisten Bindestrichen als `-TR- - undertone (2026)` in der Vorschau verblieb.

## Ursachenanalyse
1. `RX_MID_CC` erkannte bisher nur Klammern (`[TR]`, `(TR)`), nicht aber Bindestrich-Ketten (`-TR-`) oder andere Trennzeichen (`|TR|`, `_TR_`).
2. Nach dem Entfernen der Qualitäts- und Codec-Tags (`4K`, `HDR`) war das `TR` nicht mehr am Stringanfang, wodurch der Präfix-Regex `RX_CC_PREFIX_EXPANDED` nicht griff.
3. `clean_edges` schnitt nur Trennzeichen ab, wenn danach/davor Leerzeichen standen, wodurch isolierte Kantenzeichen verblieben.

## Lösung in v48
1. **Delimited Tags**: `RX_MID_CC` erweitert auf Trennzeichen-Begrenzung `(?:[\[\(]|[-_|:–—/]\s*)(?:CC)(?:\s*[-_|:–—/]|[\]\)])`.
2. **Mehrstufige Bereinigung**: `RX_MID_CC` wird vor und nach der Qualitäts-/Codec-Entfernung angewendet, um freigelegte Tags restlos zu erfassen.
3. **Suffix-Kürzel**: `RX_CC_SUFFIX` erkennt und entfernt Länderkürzel am Ende des Titels.
4. **Randzeichen**: `clean_edges` säubert alle führenden und nachlaufenden Trennzeichen restlos.
5. **Kollisionsschutz**: Wortkollisionen (z. B. `ALICE IN WONDERLAND`, `NO COUNTRY FOR OLD MEN`, `IT (2017)`) sind durch strikte Trennzeichenanforderung und Mindesttitel-Prüfung geschützt.

## Testergebnisse
- 73/73 Unit-Tests erfolgreich
- 5/5 Gruppierungstests erfolgreich
- 42/42 Selbsttests erfolgreich
- JS-Syntaxprüfung fehlerfrei
- Keine Anbieter-Anfragen
