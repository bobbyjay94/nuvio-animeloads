# Onyx Merge – Übergabebericht an Claude

**Stand:** 6. November 2026, Onyx Merge v39 (`2026.11.06.01`)  
**Projekt:** Eigenständige IPTV-Adminoberfläche / Merger / Editor / Master. Nicht der IPTV-Player.  
**Arbeitsbasis:** v38-Quellpaket (`onyx-merge-v38.tar.gz`), erweitert um Paket G und H.  
**VPS:** Nutzer meldete, dass frühere Pakete selbst eingespielt wurden; v39 wurde hier nicht auf dem VPS installiert oder live geprüft.

## 1. Wichtige Arbeitsregeln und Nutzerwünsche

- Ausschließlich Onyx Merge bearbeiten, nicht den IPTV-Player.
- Keine Änderungen am bisherigen Aussehen, Hintergrund, Farben, Logo, Schrift oder Layout ohne ausdrückliche Freigabe. Mockups waren nur Vorschauen; spätere Designänderungen wurden verworfen.
- Nutzer arbeitet am VPS schrittweise mit einzelnen Befehlen. Keine Serverbefehle selbst ausführen und keine Passwörter/privaten Schlüssel im Chat anfordern.
- Besonders wichtig: Provider-IP-Sperren vermeiden. Keine häufigen Anfragen, keine zusätzlichen Availability-Pings, kein automatisches Probe-Streaming. Vorhandene Guard-/Drosselungslogik respektieren.
- Änderungen lokal testen und ein herunterladbares vollständiges Archiv liefern. Claude-Bericht/Übergabe soll die Architekturentscheidungen, Änderungen, Tests, Einschränkungen und nächsten Schritte dokumentieren.
- Bei Failover keine Funktionsversprechen machen, die aufgrund von direktem HTTP-302-Streaming nicht gehalten werden können.

## 2. Produkt- und Betriebsüberblick

Onyx Merge ist eine eigenständige Python-/HTML-Adminanwendung mit Vanilla-JS-Oberfläche und Python-Standardbibliothek. Sie verwaltet Provider A/B, Kunden, IPTV-Kategorien und Inhalte, Editor-Kuration, Pakete/Vorlagen, Provider-Sync, Stream-Weiterleitungen, Betrieb/Diagnose, EPG, Backups und eine VPS-Installation. Der Kundenstream wird grundsätzlich direkt zum Anbieter weitergeleitet (HTTP 302); der VPS proxy’t den Streamkörper nicht.

Relevante Laufzeit-/Paketinfos aus dem Projektverlauf:
- Service-Installationsort: `/opt/onyx-merge`.
- Nutzer hat beim VPS-Zugang SSH-Port `48221` verwendet; in früheren Befehlen waren mehrere IP/Benutzernamen im Gespräch. Keine Adresse ungeprüft verwenden.
- Versionsnotiz in v38: `2026.11.05.26`; aktuelle v39: `2026.11.06.01`.
- Aktuelle v39 erstellt aus dem v38-Paket, lokal getestet. Nicht mit dem live installierten VPS gleichsetzen.

## 3. Chronologie wichtiger Entwicklungsschritte aus dem bisherigen Chat

### v28 – Baseline / Paket A
- Nutzer stellte `onyx-merge-v28.tar.gz` und eine Backend-Analyse bereit.
- Ausgangsstand enthielt Paket A (M1–M6 und M13); 42 Integration-Selbsttests wurden als bestanden gemeldet.
- Nutzer installierte die Pakete selbst per Windows-SSH/SCP und führte Befehle schrittweise aus.

### v29 – Paket B / Leistung und Stabilität
- M7: Zeitlimits und Thread-/Parallelitätsbegrenzungen.
- M8: LRU-Begrenzung für Antwortcache.
- M9: kompaktere Katalog-JSON-Ausgabe.
- M11: Fehlerübersicht/Alarmierung.
- M12: Antwortzeitmetriken/Administrationsanzeige.
- Nutzer bestand auf einzelnen Befehlen und kontrolliertem Update-Ablauf.

### v30 – Paket C / Systemabsicherung und Nginx
- M10: systemd-Absicherung (u. a. Nice, Watchdog, Memory-Grenzen); Watchdog-Kompatibilität wurde als etwas zu verifizieren vermerkt.
- M14: Nginx-Pufferung für Listenabrufe. Geplanter Ablauf: Konfiguration sichern, ändern, `nginx -t`, bei Erfolg reload; bei Fehler Original wiederherstellen und protokollieren.
- Stream-Antworten bleiben direkte 302-Weiterleitungen.

### v31 – Paket D / Wartung, Integrität, Schutzfunktionen
- I3 Plausibilitätsprüfung bei Provider-Rescans, damit unvollständige Listen nicht leicht Daten verlieren.
- I4 nächtliche SQLite-Wartung.
- I6 Speicherwächter/Cachefreigabe.
- I9 EPG-Bereinigung.
- I10 wöchentlicher Telegram-Bericht.
- I11 verständliche Login-Hilfen.
- Erste Testfassung hatte einen instabilen JSON-Reparaturtest; anschließend berichtete der Nutzer 42/42 Tests, 0 Fehler, Dienst aktiv und Version `2026.11.05.19`.

### v32 – I12 manuell bestätigter IP-Wechsel
- IP-Wechsel-/Statusfunktion mit `/api/switch_egress`, Statusanzeigen und Admin-Aktionen.
- Warnung: Interface-Adressen waren lokal nicht bindbar bestätigt; IP-Verfügbarkeit nicht ungeprüft behaupten.

### v33–v34 – Editor-Kategorien und Fusionen
- Mehrfachauswahl/-umbenennung für Live-TV, Filme und Serien.
- Fusionieren: Quelle(n) zu zuerst ausgewählter Zielkategorie; Quellen ausblenden; neu vom Provider kommende Inhalte der Quellkategorie sollen über gespeicherte `cat_sources` weitergeleitet werden.
- Kompaktere „Was ist neu“-Ansicht.
- v34: Fusions-Badges, Quelle→Hauptkategorie-Hinweise, Detailanzeige und Trennen-Funktion.

### Designberatung und Paketplan
- Der Nutzer stellte klar, Onyx Merge sei ein eigenständiges Admin-/Merger-/Editor-Master-Projekt, nicht der IPTV-Player.
- Vorgeschlagene Designvarianten waren nur Mockups; Nutzer verwarf jegliche Änderungen am Aussehen. Daher keine optischen Eingriffe durchführen.
- Paket E–H: Name-Cleaner/Auto-Sort, Logo-Matcher, Multi-Provider-Matrix/Fallback, Sync-Shield.

### v35 – Paket E: Name-Cleaner / Smart Auto-Sort
- Bereinigung von Länderpräfixen, Dekoration, Werbewörtern, Qualitäts-/Codec-Resten; konsistente Qualitätsbezeichnungen.
- Sortierung `clean_az` und `quality`; API-Vorschau und Bulk-/Kategorieaktionen; Journal/Undo.
- Nutzer meldete anschließende Installation als erfolgreich.

### v36 – Paket F: Logo-Matcher
- Nutzt nur bereits geladene View-/Katalogdaten. Keine externen Provider-Abfragen.
- Vorschau, Einzel-/Bulk-/Kategorie-Zuweisung und bestehende lokale Logos.
- Nach Freigabe auf persistentes Speichern und Undo achten.

### v37–v38 – IST-Zustand als Paket speichern und Hotfix
- Benutzer wollte Editor-Zustand als benennbares Kundenpaket/Vorlage unter „Pakete“ speichern.
- v37 ergänzte „Als Paket speichern“.
- Nutzer berichtete rotes Fragezeichen nach Bestätigung aller drei Kategorien. Ursache im bisherigen Bericht: Handler war im falschen Routing-Bereich, POST erhielt 404.
- v38 verschob Handler ins POST-Routing; lokaler Handler-Test und Undo-Journaling wurden ergänzt. Nutzer meldete v38-Installation erfolgreich.

### v39 – Paket G & H (aktueller lokaler Stand)
- Der Nutzer gab nach v38 sein OK, „alle Punkte vom Plan fertig“ zu machen. v39 wird lokal als v38-Baseline weiterentwickelt.
- Details siehe Abschnitt 4. VPS-Update noch nicht erfolgt.

## 4. v39 Implementierung – Paket G/H

### Paket G: Stream-Matrix für Live-TV
- Neue Admin-Unterseite „Stream-Matrix“.
- Ermittelt Kandidaten ausschließlich aus bereits geladenen In-Memory-Katalogdaten. Normalisiert Namen mit vorhandenen Cleaner-Funktionen; mehrdeutige Matches werden ausgelassen.
- Admin kann eindeutige A/B-Varianten verknüpfen, bevorzugten Provider speichern und Paarungen trennen.
- Speicherung erfolgt unter `curation["stream_links"]`; öffentliche Stream-IDs bleiben stabil und werden zur gewählten Provider-Original-ID aufgelöst.
- Paarungen nur für Live-TV. Filme/Serien sind nicht Teil der Matrix.
- Der HTTP-302-Stream-Endpunkt kann keine nachgelagerte Player-Fehlermeldung sehen. Deshalb kein echtes Playback-Health-Probing und kein automatisches Failover aufgrund eines tatsächlichen Streamabbruchs.
- Umschalten erfolgt anhand des bereits vorhandenen lokalen Provider-Wächterzustands (`guard_paused`) oder wenn die Kunden-Line für den bevorzugten Provider keine Zugangsdaten hat und die Partner-Line schon. Kundenspezifische Provider-Berechtigung (`user_providers`) wird beachtet.
- Es werden keine zusätzlichen Provider-Anfragen erzeugt. Kein automatisches Aktualisieren der Präferenz in der Datenbank beim Schutzstopp; die Auswahl ist pro Anfrage lokal hergeleitet.

### Paket H: Sync-Shield
- Neue Admin-Unterseite „Sync-Shield“ zeigt pro Inhaltstyp Kurationseinträge, zugeordnete Inhalte, neue/ungeprüfte Elemente und aktive Regeln.
- Die bestehende persistente Kuration bleibt die Quelle der Wahrheit; keine zweite parallele Regel-Datenbank.
- Beim Neuaufbau der Sicht wird für manuell bearbeitete Inhalte ein Index nach normalisiertem Namen erstellt.
- Name, Kategorie, Ausblendung, Logo, EPG und Reihenfolge werden nur dann auf die A/B-Variante übertragen, wenn auf beiden Seiten je genau ein Treffer existiert. Mehrdeutige/duplizierte Namen bleiben unangetastet.
- Übernommene Kuration wird unter der Ziel-ID in `curation["channels"]` gespeichert und erhält `sync_shield_from` als Herkunftshinweis.
- Keine externen Provider-Abfragen.

### Geänderte Dateien in v39
- `onyx_merge.py`: Version/CHANGES, local-only Stream-Matrix-Funktionen, Sync-Shield-Report und eindeutige Kurationsübernahme bei `build_view`, GET/POST API-Endpunkte, Kunden-bewusste Streamquellenwahl.
- `admin.html`: zwei neue Unterseiten in der bestehenden Listen-Navigation, UI-Ansicht und API-Interaktionen.
- `tests/unit_core.py`: Tests für lokale Paarsuche, A/B-ID-Zuordnung, Schutzstopp-Fallback und eindeutige Sync-Shield-Übernahme.
- `RELEASE-v39.md`: Kurznotizen im Archiv.
- Keine visuellen Änderungen an bestehendem Theme/Logo/Hintergrund; die neuen Seiten nutzen vorhandene Layout-/Komponentenstile.

## 5. Tests und Grenzen

Lokal bestätigt:
- `python3 -m py_compile onyx_merge.py` bestanden.
- `tests/unit_core.py`: `ALLES OK: 0 fehlgeschlagen` (bestehende Regressionstests plus G/H-Tests).
- `tests/selftest.py`: `42 bestanden, 0 fehlgeschlagen`.
- JavaScript aus `admin.html` extrahiert und `node --check` bestanden.
- Die Test-Fixtures für beschädigte `users.json`/`tests.json` erzeugen erwartete Fehlerlogs; die Tests selbst bestehen.

Nicht bestätigt:
- Kein VPS-Deploy oder Live-Test in dieser Session.
- Nicht bestätigt, dass reale Anbieter-/Kunden-Kataloge alle Match-Kantenfälle abdecken.
- Keine automatische Erkennung von Stream-Ausfällen. Ein solches Feature bräuchte eine echte Rückmeldung aus dem Player oder Provider-Testanfragen, die wegen IP-Sperr-Risiko aktuell nicht gesendet werden.
- Der bestehende GitHub-Branch `template` wurde nur gelesen; in dieser Übergabe ist noch kein Commit/Upload bestätigt.

## 6. Paket- und Download-Hinweis

Das v39-Archiv wird als vollständiges Programm-Paket auf Grundlage der vorliegenden v38-Quelle gepackt, inklusive UI-Assets, Tests und Release-Hinweisen. Frühere separate v29–v38-Archive waren in dieser Arbeitsumgebung nicht alle verfügbar und sind daher nicht als historische Artefakte im v39-Archiv enthalten. Nicht behaupten, dass das v39-Archiv alle historischen Versionen/Installationsarchive enthält.

## 7. Nächste Schritte für Claude / den Nutzer

1. Wenn Nutzer v39 installieren will: zuerst `onyx-merge-v39.tar.gz` herunterladen und wie gewohnt mit dem bestehenden sicheren Update-Verfahren einspielen. Keine VPS-Zugangsdaten anfordern.
2. Nutzer soll nach Installation die zwei neuen Listen-Unterpunkte prüfen: Stream-Matrix und Sync-Shield. Zunächst nur ein Testpaar manuell verknüpfen und prüfen, dass Kunde beide Provider-Line-Zugänge besitzt.
3. Für Sync-Shield zuerst ein Backup/Sicherungspunkt vor dem ersten produktiven Rescan empfehlen. Bei eindeutigen Namen eine Testbearbeitung in A vornehmen und nach kontrolliertem Rescan B prüfen; keine Vollautomatik behaupten.
4. Paketweiterentwicklung erst nach dem Nutzerfeedback. Keine Designänderung ohne erneute ausdrückliche Freigabe.
