# Onyx Merge – Vollständiger Übergabe- und Entwicklungsbericht für Claude
**Datum:** 2026-11-06 (Stand Version v35)
**System:** Onyx Merge – Eigenständiges IPTV-Admin-, Merger- und Editor-Master-Panel (Python 3 Standardbibliothek + Vanilla JS/HTML/CSS)
**Ziel-Server (VPS):** Port 48221 SSH, Dienstverzeichnis `/opt/onyx-merge`

---

## 1. Übersicht & Kontext
Dieser Bericht dokumentiert lückenlos alle Entwicklungsschritte, Architekturentscheidungen und Code-Änderungen seit Beginn der Zusammenarbeit im Lovable-Chat. Alle Änderungen folgen den strikten Vorgaben:
- **Keine Design-/Optik-Änderungen:** Farbschema (Onyx Dunkel), Schriftarten, geometrischer Hintergrund und UI-Layout von v34 bleiben vollständig erhalten.
- **Höchste Engineering-Standards:** Saubere Trennung von Vorschau und Mutation, vollständige Journal-Aufzeichnung mit 1-Klick-Rückgängig-Funktion (Undo), defensive Programmierung ohne externe Abhängigkeiten.
- **100 % Testabdeckung:** Alle 29 Unit-Tests in `tests/unit_core.py` und alle 42 System-Selbsttests in `tests/selftest.py` bestehen fehlerfrei.

---

## 2. Chronologie der Versionen und Pakete

### Paket A (v28) – Baseline
- M1–M6 & M13: Grundlegende Stabilitätsprüfungen, 42 Selbsttests bestanden.

### Paket B (v29) – Performance & Stabilität
- **M7 (Zeitlimits & Lastbegrenzung):** 60 s Timeout für App-Anfragen, 120 s für Admin-Anfragen, `max_workers = 64` im `BoundedThreadingHTTPServer`.
- **M8 (Speicherbegrenzung):** LRU-Begrenzung des Antwort-Zwischenspeichers (`RespCache`) auf ca. 300 MB.
- **M9 (Kompakte Kataloge):** JSON-Speicherung ohne unnötige Leerzeichen (`separators=(',', ':')`) für bis zu 35 % schnellere Ladezeiten.
- **M11 (Fehlererkennung & Alarmierung):** Ringpuffer der letzten 50 Serverfehler (`err_recent`) und Schwellenwert-Alarmierung.
- **M12 (Antwortzeitmetriken):** Erfassung von P50, P95 und Maximalzeiten je Endpunkt-Klasse mit Visualisierung im Admin-Panel.

### Paket C (v30) – System-Absicherung & Nginx
- **M10 (systemd-Absicherung):** `Nice=5`, `WatchdogSec=120`, `MemoryHigh=2500M`, `MemoryMax=3000M` in `onyx-merge.service`.
- **M14 (Nginx-Pufferung):** `apply_domains.py` mit `proxy_buffering on`, `proxy_buffer_size 128k`, `proxy_max_temp_file_size 128m` zur Entlastung der Python-Worker bei langsamen Client-Verbindungen.

### Paket D (v31) – Schutz vor Datenverlust & Wartung
- **I3 (Plausibilitätsprüfung beim Abgleich):** Bricht Abgleich ab, falls ein Anbieter plötzlich mehr als 50 % seiner Sender verliert (Schutz vor unvollständigen Listen).
- **I4 (Nächtliche Datenbankwartung):** Automatisches Bereinigen und `VACUUM` für SQLite (`stats.db`, `diag.db`, `epg.db`, `journal.db`).
- **I6 (Speicher-Wächter):** Automatisches Freigeben von Caches bei Speicherspitzen.
- **I9 (EPG-Pruning):** Löschen verwaister EPG-Daten für nicht mehr vorhandene Sender.
- **I10 (Wöchentlicher Telegram-Bericht):** Statusübersicht mit Kunden-, Sender- und Fehlerzahlen.
- **I11 (Hilfenachrichten für Logins):** Klare Rückmeldungen bei abgelaufenen oder falschen Zugängen.

### v32 – Sicherer IP-Wechsel (I12)
- **I12 (Manuell bestätigter IP-Wechsel):** Anzeige der aktiven Absender-IP (`51.68.192.142`), Failover-IP (`51.68.193.204`) und VPS-Haupt-IP (`51.38.64.30`).
- Neuer Endpoint `POST /api/switch_egress` mit Sicherheitsabfrage vor Umschaltung.

### v33 – Editor: Mehrfachauswahl & Kategorie-Fusion
- Mehrfachauswahl (Checkboxen) für Live-TV, Filme und Serien im Editor.
- Neuer Endpoint `POST /api/fuse_cats`: Leitet Quellkategorien auf Zielkategorie um, blendet Quellkategorien für Kunden aus und persistiert die Zuordnung in `curation["cat_sources"]`.
- Responsive „Was ist neu?“-Versionsübersicht mit einklappbarem Akkordeon.
- Info-Popovers bei Provider- und Domain-Einstellungen.

### v34 – Editor: Fusions-Badges & Trennen
- Transparenzanzeige: Fusions-Badge `🔀 +X` an Hauptkategorien, Hinweis `→ in [Hauptkategorie]` an eingebundenen Quellen.
- Endpoint `POST /api/unfuse_cat`: 1-Klick-Trennen einer fusionierten Kategorie mit automatischer Wiedereinblendung.

### v35 – Editor: Name-Cleaner & Smart Auto-Sort (Paket E) – AKTUELL
- **Intelligenter Name-Cleaner (`clean_item_name`):**
  - Entfernt Länderkürzel am Anfang: `DE |`, `[DE]`, `DE:`, `DE-`, `TR:`, `FR -` etc.
  - Entfernt störende Deko-Symbole und Trenner (`★`, `▶`, `►`, `●`, `|`, `┃` etc.).
  - Entfernt Werbewörter: `VIP`, `PREMIUM`, `PLATINUM`, `GOLD`, `SERVER 1` etc.
  - Entfernt Codec- und FPS-Reste: `50FPS`, `60FPS`, `HEVC`, `H.265`, `RAW`, `MULTI-AUDIO`.
  - Vereinheitlicht Auflösungs-Tags am Namensende: `4K`, `UHD`, `FHD`, `1080p`, `HD`, `720p`, `SD` werden erkannt und sauber formatiert (`SKY SPORT 1 FHD`, `TRT 1 4K`).
  - Behält Backup-Tags sauber bei (`(Backup)`).
- **Smart Auto-Sort (`sort_category`):**
  - Modus `clean_az` (A–Z bereinigt): Sortiert alphabetisch nach dem bereinigten Sendernamen (ignoriert `DE |`, Deko und VIP) – alle Sky-, DAZN- oder ARD-Sender stehen sofort zusammen.
  - Modus `quality` (Nach Qualität): Sortiert 4K/UHD → FHD → HD → SD zuerst, innerhalb gleicher Qualität alphabetisch.
- **Neuer API-Endpoint `POST /api/clean_names`:**
  - Unterstützt `preview: true` (ermittelt Änderungen ohne Mutation für Dialogvorschau).
  - Unterstützt selektive Bereinigung einzelner Senderauswahlen (`vids`) oder ganzer Kategorien (`cat`).
  - Vollständige Journal-Integration mit 1-Klick-Rückgängig-Funktion (`Undo`).
- **Benutzeroberfläche in `admin.html`:**
  - Button `✨ Namen säubern` im Kategorie-Kopf mit Bestätigungsdialog und Vorher-Nachher-Vorschau.
  - Button `✨ Säubern` in der Mehrfachauswahl-Leiste (Bulk-Aktionen).
  - Erweiterung des Sortiermenüs um `A–Z (bereinigt)` und `Nach Qualität (4K → FHD → HD)`.

---

## 3. Fahrplan der weiteren Pakete
- **Paket F (Logo-Matcher):** Fehlende Sender-Logos automatisch erkennen, Vorschläge aus vorhandenen Provider-Logos unterbreiten und mit 1-Klick zuweisen.
- **Paket G (Multi-Provider-Stream-Matrix & Failover):** Identische Sender beider Anbieter verknüpfen; automatisches oder manuelles Umschalten bei Provider-Ausfall.
- **Paket H (Intelligenter Sync-Shield – USP):** Kurationen, Namensänderungen, Fusionen und Sortierungen dauerhaft gegen nächtliche Provider-Updates absichern; automatische Einordnung neuer Sender.

---

## 8. Paket F: Intelligenter Logo-Matcher (v36 - 2026.11.05.24)
- **Problemstellung:** Nach dem Zusammenführen zweier Anbieter oder bei Provider-Updates fehlen bei manchen Stream-Varianten (z. B. FHD, UHD oder Backup) Senderlogos, obwohl eine andere Variante (z. B. HD oder der andere Provider) ein perfektes Logo besitzt.
- **Wichtigste Anforderung (Emre):** KEINE externen Anfragen an die Anbieter-IPs! Zu viele Provider-Anfragen führten in der Vergangenheit zu temporären IP-Sperren.
- **Umsetzung & Architektur:**
  1. **100% lokal im Server-RAM:** `find_logo_matches_in_view()` durchsucht ausschließlich den bereits im Arbeitsspeicher geladenen Katalog (`view`). Es wird keine einzige HTTP-Anfrage an externe Server oder Anbieter geschickt.
  2. **Intelligenter Match-Algorithmus:** Nutzt `clean_base_name()`, um Sender über Normalisierung (Entfernen von `DE |`, `[DE]`, Qualitäts-Tags wie `4K/FHD/HD`, Werbewörtern wie `VIP`) präzise zusammenzuführen.
  3. **Backend-API (`/api/match_logos`):** Unterstützt `preview: true` (zeigt gefundene Spender und Logos vorab) sowie `preview: false` mit Journal-Aufzeichnung für nahtloses Undo.
  4. **Admin UI (`admin.html`):**
     - Button `⚡ Logo-Matcher` in der Bulk-Aktionsleiste für markierte Sender.
     - Button `⚡ Logos ergänzen` in der Kategorie-Kopfzeile für eine ganze Kategorie.
     - Vorschau-Dialog mit Logo-Miniatur, Name und Spender-Quelle.
- **Tests & Qualität:**
  - 3 neue Unit-Tests in `tests/unit_core.py` (insgesamt 34 Unit-Tests).
  - 42/42 Selftests im offiziellen Updater-Testsuite bestanden.

---

## 9. Paket: IST-Zustand als Vorlage/Paket speichern (v37 - 2026.11.05.25)
- **Anforderung (Emre):** Über den Editor den aktuellen IST-Zustand der sichtbaren Kategorien per Klick als Paket/Vorlage benennen und unter „Pakete“ abspeichern, um es Kunden direkt zuweisen zu können.
- **Wichtig:** 100% lokal im RAM, 0 Anfragen an Anbieter-IPs.
- **Umsetzung:**
  1. **Aktionsmenü im Editor:** Neuer Menüpunkt `📦 Als Paket speichern …` unter dem `⋯`-Menü der Kategorienleiste.
  2. **Namensvergabe & Bereichswahl:** Fragt nach einem Paketnamen und ob alle Bereiche (Live, VOD, Serien) oder nur der aktuell geöffnete Bereich übernommen werden sollen.
  3. **Backend-API (`/api/package_from_state`):** Liest die aktiven/sichtbaren Kategorien (`show == True`) aus `view` aus und erzeugt ein vollwertiges Paket in `curation["packages"]`.
  4. **Integration:** Das erstellte Paket steht sofort unter dem Menüpunkt **Pakete** zur Verfügung und kann Kunden in der Kundenverwaltung zugewiesen werden.
  5. **Undo-Unterstützung:** Kann bei Bedarf im Verlauf/Journal mit 1-Klick rückgängig gemacht werden.
- **Tests:**
  - 36 Unit-Tests bestanden.
  - 42/42 Selftests bestanden.

---

---

## 10. Hotfix: Paket-Speichern Fehlerbehebung (v38 - 2026.11.05.26)
- **Fehlerbild:** Nach Bestätigung von „mit ok alle 3 kategorien im paket speichern“ erschien am unteren Bildschirmrand ein rotes Toast-Feld mit einem Fragezeichen (?).
- **Ursachenanalyse:**
  1. In `v37` wurde der Handler `if u.path == "/api/package_from_state":` versehentlich in der HTTP-Methode `do_GET` platziert (vor dem GET-Handler von `/api/packages`).
  2. Der vom Frontend gesendete POST-Request erreichte `_do_POST()`, fand dort keinen Eintrag für diesen Pfad und fiel in das Default-Routing am Ende von `_do_POST()`: `self.send(404, {"error": "?"})`.
  3. Die Frontend-Hilfsfunktion `api()` fing den 404-Status ab, las `j.error` (`"?"`) aus und rief `fail(err)` auf, welches `toast("?", {bad: true})` darstellte (roter Kasten mit ?).
- **Behebung in v38:**
  1. Handler aus `do_GET` entfernt und sauber in `_do_POST` direkt vor `if u.path == "/api/packages":` platziert.
  2. Neuer Integrationstest in `tests/unit_core.py`, der einen simulierten POST-Request direkt über `AdminHandler._do_POST` an `/api/package_from_state` schickt und HTTP 200 sowie die korrekte Anlage in `curation["packages"]` prüft.
- **Testergebnisse:**
  - Alle Unit-Tests inkl. dem neuen Integrationstest bestanden (0 Fehler).
  - 42/42 Selftests im offiziellen Updater-Testlauf bestanden (0 Fehler).
