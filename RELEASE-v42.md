# Onyx Merge v42 – Release Notes (2026.11.06.04)

## Wächter-Herzschlag (Watchdog M10) & Stream-Vorschau für Failover-Sender

### 1. Wächter-Herzschlag dauerhaft stabil (M10)
- **Problem behoben:** In v41 wurde `_start_watchdog_thread()` beim Programmstart nicht aktiviert. Zudem erbten Kindprozesse (`systemctl is-active`) die Variable `NOTIFY_SOCKET`, was zu systemd-Warnungen (`Got notification message from PID x, but reception only permitted for main PID y`) und nach exakt 120 Sekunden zum Watchdog-Timeout (`SIGABRT`) führte. Dies war die Ursache für wiederholte Dienstrestarts und `Failed to fetch`-Fehler im Browser.
- **Lösung:**
  - Interner Herzschlag-Daemonthread in `onyx_merge.py` sendet alle 20 Sekunden ein `WATCHDOG=1`-Signal an den systemd-Datagram-Socket.
  - Subprozesse (`systemctl`, `hostname`, `ip`) erhalten eine bereinigte Umgebung ohne `NOTIFY_SOCKET`.
  - `onyx-merge.service` setzt explizit `NotifyAccess=main`.
  - Ergebnis: Vollkommen stabiler Dauerbetrieb ohne Abbrüche oder Neustart-Schleifen.

### 2. Stream-Test im Failover-Partner-Dialog
- **Kandidaten vor Zuweisung testen:** Bei der Suche nach passenden Ausweichsenden im Failover-Modal (`⚡`) hat jeder gefundene Partnersender ab sofort einen `▶ Testen`-Button. Ein Klick öffnet direkt den Test-Player (mit HLS, MPEG-TS oder VLC-Download).
- **Aktiven Partner testen:** Bei bereits verknüpften Sendern gibt es nun zwei Schnelltests:
  - `▶ Partner testen` – prüft direkt den Ausweichstream des Partnersenders.
  - `▶ Haupt testen` – prüft den primären Hauptstream.

### 3. Stream-Test in der Stream-Matrix
- In der Matrix-Tabelle verfügen jetzt beide Spalten (**Anbieter A** und **Anbieter B**) über einen kompakten `▶ Test`-Button.
- Im manuellen Paarungsdialog (`+ Manuelles Paar anlegen`) können Kandidaten beider Anbieter vor dem Speichern probegehört und gegengeprüft werden.

### 4. 100% Provider-IP-Schutz & Zero-Polling Garantie
- Der VPS stellt für den Test-Player lediglich die vorbereitete Abspieladresse bereit (`/api/playurl`).
- **Der VPS fragt dabei selbst niemals Videodaten oder Streams beim Anbieter an.**
- Die Wiedergabe erfolgt ausschließlich direkt im Browser des Administrators (über die IP des PCs). Deine Server-IPs auf dem VPS bleiben vollständig geschützt.

### Tests & Verifikation
- 63/63 Unit-Tests bestanden (inkl. systemd-Watchdog-Socket-Test und Umgebungsbereinigung).
- 42/42 Selftests bestanden.
- JavaScript-Syntaxprüfung für `admin.html` erfolgreich validiert.
