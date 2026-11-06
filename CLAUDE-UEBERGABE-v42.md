# Claude-Übergabebericht – Onyx Merge v42 (2026.11.06.04)

## Durchgeführte Arbeiten

1. **Watchdog-Diagnose & M10-Stabilisierung:**
   - Analyse der VPS-Logs (`journalctl -u onyx-merge`): Systemd Watchdog griff nach 120s ein (`Failed with result 'watchdog'`), weil Python den Herzschlag-Thread nicht gestartet hatte und Child-PIDs den Socket ansprachen.
   - Implementierung des periodischen `WATCHDOG=1`-Heartbeats im Hauptprozess (`_start_watchdog_thread`) alle 20s.
   - Bereinigung der Subprozess-Umgebungen (`_clean_env()`) zur Vermeidung von `NotifyAccess`-Verletzungen durch `systemctl`.
   - Ergänzung von `NotifyAccess=main` in `onyx-merge.service`.
   - Unit-Test zur Verifikation der Socket-Übertragung implementiert.

2. **Stream-Vorschau für Failover-Zuweisung:**
   - Erweiterung von `openFailoverModal()`: `▶ Testen`-Buttons für jeden Kandidaten in der Auswahlliste.
   - Erweiterung bei aktiver Verknüpfung: `▶ Partner testen` und `▶ Haupt testen`.
   - Erweiterung der Stream-Matrix: `▶ Test`-Buttons für Anbieter A und B in jeder Tabellenzeile sowie im manuellen Paarungsdialog.
   - Anhebung des Modal-Z-Index für `#pmodal` auf 30, damit der Player nahtlos über geöffneten Einstellungs-Modals schwebt.
   - Schutz der Provider-IPs beibehalten (VPS führt keine Probe-Streams durch; Wiedergabe via Client-Browser).

## Testergebnisse
- `unit_core.py`: 63 Tests bestanden, 0 fehlgeschlagen.
- `selftest.py`: 42 Tests bestanden, 0 fehlgeschlagen.
- `admin.html`: JS-Syntaxprüfung fehlerfrei.
