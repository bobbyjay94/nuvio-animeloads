# Claude-Übergabebericht – Onyx Merge v43 (2026.11.06.05)

## Durchgeführte Arbeiten

1. **Bugfix Failover-Partnersuche (`/api/stream_failover_partner`):**
   - Fehleranalyse des Screenshots von Emre: Bei der Suche nach "Bein spor" im Failover-Dialog erschienen `BR HD`, `HR HD`, `SR HD`.
   - Ursache: Sender mit kurzem Namen wurden bei `clean_base_name` zu `""` bereinigt. Der Substring-Check `c_clean in cur_clean` traf auf `"" in cur_clean` und erzeugte Score 70 für Dutzende unpassende Sender, die vor echten Suchergebnissen platziert wurden.
   - Behebung:
     - Wenn `q` angegeben ist, müssen alle Tokens im Namen oder Originalnamen vorkommen.
     - Relevanz-Bonus für Sendernummern-Übereinstimmung (z.B. Ziffer "1").
     - Ohne `q` werden leere Basisnamen ignoriert.
   - Frontend `admin.html`: Sofortsuche bei `Enter` und 200ms Debounce.

2. **Testabdeckung:**
   - Neuer Test in `unit_core.py`: `Failover API: Suche 'Bein spor' findet BEIN SPORT 1 FHD und schließt BR HD aus`.
   - 64 Unit-Tests und 42 Selftests erfolgreich bestanden.
