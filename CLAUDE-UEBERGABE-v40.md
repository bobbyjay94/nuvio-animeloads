# Onyx Merge – Übergabebericht an Claude (v40)

**Stand:** 6. November 2026, Onyx Merge v40 (`2026.11.06.02`)  
**Projekt:** Eigenständige IPTV-Adminoberfläche / Merger / Editor / Master (nicht der IPTV-Player).  
**Arbeitsbasis:** v39-Quellpaket (`onyx-merge-v39.tar.gz`), erweitert um High-Availability Reconnect Failover & Circuit Breaker.  
**VPS:** Lokales Release-Archiv erstellt und via GitHub-Branch `template` bereitgestellt. Noch nicht auf dem VPS installiert.

## 1. Gelöstes Problem
Bisherige Einschränkung in v39: Durch direkte HTTP-302-Weiterleitung zum Anbieter erfuhr der Merger nichts von späteren Stream-Abbrüchen. Ein aktives Scannen/Pollen der Anbieter-Streams verbot sich wegen des hohen Risikos von Provider-IP-Bans.

## 2. Umgesetzte Architektur (v40)
- **Passive Reconnect-Erkennung (`evaluate_stream_failover`):**
  - In-Memory TTL Ringpuffer (`_CLIENT_STREAM_HISTORY`) speichert letzte Client-Stream-Aufrufe.
  - Wenn derselbe Client denselben Sender innerhalb von 0.8s–12.0s erneut anfordert $\rightarrow$ automatische Umschaltung auf Backup-Provider.
  - Null zusätzliche HTTP-Anfragen an die Anbieter (100% Schutz vor IP-Sperren).
- **Stream Circuit Breaker (`_STREAM_CIRCUIT_BREAKERS`):**
  - Häufen sich Reconnects auf einem Sender ($\ge 2$ in 60s), wird der primäre Anbieter für 120s als gestört markiert.
  - Folgekunden erhalten sofort den Partner-Anbieter ohne Erstausfall.
- **Berechtigungsprüfung:**
  - Umschaltung greift nur, wenn der jeweilige Kunde für den Zielanbieter Zugangsdaten hat und der Anbieter nicht im lokalen Schutzstopp (`guard_paused`) ist.
- **Admin UI & API:**
  - `GET /api/stream_failover_status` & `POST /api/stream_failover_reset`.
  - Live-Monitoring-Kachel in `admin.html` (Stream-Matrix-Seite).

## 3. Verifikation
- `python3 -m py_compile onyx_merge.py`: OK.
- `tests/unit_core.py`: Alle Tests OK (0 fehlgeschlagen).
- `tests/selftest.py`: 42 bestanden, 0 fehlgeschlagen.
- JavaScript `node --check`: OK.
