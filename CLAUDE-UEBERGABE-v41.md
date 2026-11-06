# Onyx Merge – Übergabebericht an Claude (v41)

**Stand:** 6. November 2026, Onyx Merge v41 (`2026.11.06.03`)  
**Projekt:** Eigenständige IPTV-Adminoberfläche / Merger / Editor / Master (nicht der IPTV-Player).  
**Arbeitsbasis:** v40-Quellpaket (`onyx-merge-v40.tar.gz`), erweitert um vollständige Failover-Senderzuweisung & Rollenverwaltung.  
**VPS:** Lokales Release-Archiv erstellt und via GitHub-Branch `template` bereitgestellt.

## 1. Übersicht & Zielsetzung
In v40 wurde die Engine für passives Reconnect-Failover und Circuit Breaking implementiert. In v41 wurde die vollständige Konfigurierbarkeit fertiggestellt: Der Admin kann exakt bestimmen, welcher Sender Hauptquelle und welcher Failover-Partner ist, Paare im Sender-Editor oder in der Matrix zuweisen, Rollen per 1-Klick tauschen sowie Massenverknüpfungen (Bulk) und manuelle Custom-Paare anlegen.

## 2. Umgesetzte Architektur (v41)
- **Rollenfestlegung (`primary` / `backup` / `selected`):**
  - In `curation["stream_links"]` wird die Zuweisung symmetrisch unter `live:{vid_a}` und `live:{vid_b}` geführt.
  - Symmetrische Auflösung in `stream_link_for()` gewährleistet, dass sowohl beim Aufruf der A-VID als auch der B-VID der definierte Hauptsender primär ausgeliefert wird.
- **Neue & erweiterte API-Endpunkte:**
  - `GET /api/stream_failover_partner?vid={vid}&q={query}`: Lokale Suche nach Partnerkandidaten im Gegenanbieter (Null Provider-I/O).
  - `POST /api/stream_link`: Verknüpft A und B, setzt `primary`, `backup`, `enabled`, `manual`.
  - `POST /api/stream_link_bulk`: Massenverknüpfung aller eindeutigen Paare mit Modus A oder B.
  - `POST /api/stream_unlink` & `POST /api/stream_unlink_all`: Gezieltes oder vollständiges Trennen.
  - `GET /api/channels`: Liefert für Live-Sender das `failover`-Metadatenobjekt (`enabled`, `partner_vid`, `partner_name`, `is_primary`).
- **UI-Erweiterungen in `admin.html`:**
  - Sender-Editor: Failover-Status-Badge (`⚡ Haupt` / `⚡ Backup` / `⚡`) und interaktiver Zuweisungs-Modal mit Live-Kandidatensuche, Swap und Unlink.
  - Stream-Matrix: Rollenanzeige (Hauptsender ➔ Failover), Swap-Button (`⇄`), Suchfilter, Bulk-Aktionen (`A ➔ B`, `B ➔ A`, `Alle trennen`) und manueller Pairing-Dialog.

## 3. Verifikation
- `python3 -m py_compile onyx_merge.py`: OK.
- `tests/unit_core.py`: Alle Tests OK (0 fehlgeschlagen).
- `tests/selftest.py`: 42 bestanden, 0 fehlgeschlagen.
- JavaScript `node --check`: OK.
