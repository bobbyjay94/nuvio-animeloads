# Onyx Merge v41 – Release Notes (2026.11.06.03)

## Failover-Konfiguration & Präzise Sender-Zuweisung (Distinguished Engineering)

### 1. Präzise Rollenfestlegung (Hauptsender vs. Failover-Ausweichsender)
- Bei jedem verknüpften Senderpaar kannst du jetzt exakt bestimmen, welcher Sender die **Hauptquelle** ist (Standardauslieferung an Kunden) und welcher Sender als **Failover-Ausweichsender** dient.
- **1-Klick-Rollenwechsel (⇄ Swap):** Haupt- und Ausweichsender lassen sich sowohl in der Stream-Matrix als auch im Sender-Editor mit einem Klick tauschen.

### 2. Direkte Failover-Zuweisung im Senderlisten-Editor
- In der Live-TV-Senderliste zeigt jeder Kanal direkt neben dem Anbieter-Badge seinen Failover-Status:
  - `⚡ Haupt` (grün) = Dieser Sender ist die Hauptquelle für den Kunden.
  - `⚡ Backup` (blau) = Dieser Sender dient als Ausweichquelle.
  - `⚡` (dezent) = Noch kein Ausweichsender zugewiesen.
- Ein Klick auf das Symbol öffnet den interaktiven Failover-Dialog:
  - Statusübersicht mit aktuellem Partner und Ausweich-Richtung.
  - Schnelle Partnersuche im Gegenanbieter (Tippen zum Suchen).
  - Auswahl der Primärquelle ("Dieser Sender ist Hauptsender" vs. "Partner ist Hauptsender").
  - Buttons für Rollentausch und Verknüpfung trennen.

### 3. Massenverknüpfung (Bulk-Link) in der Stream-Matrix
- Mit einem Klick alle erkannten Senderpaare en bloc verknüpfen:
  - **`⚡ Alle: A ➔ B`**: Verknüpft alle Paare mit Anbieter A als Hauptsender und B als Failover.
  - **`⚡ Alle: B ➔ A`**: Verknüpft alle Paare mit Anbieter B als Hauptsender und A als Failover.
  - **`Alle trennen`**: Hebt alle Verknüpfungen mit Sicherheitsabfrage sauber auf.
- Suchfilter und Status-Chips (`Alle`, `Verknüpft`, `Offen`).

### 4. Manuelles Custom-Pairing
- Neuer Button `+ Manuelles Paar anlegen` in der Stream-Matrix:
  - Ermöglicht das Verknüpfen zweier beliebiger Sender aus Anbieter A und B, selbst wenn sich die Sendernamen komplett unterscheiden (z. B. länderspezifische Schreibweisen oder abweichende Provider-Bezeichnungen).

### 5. 100% Zero-Polling & Provider-IP-Schutz
- Alle Konfigurationen, Suchvorgänge und Failover-Prüfungen arbeiten vollständig lokal im Arbeitsspeicher und der SQLite-Kuration.
- **Garantie:** Es werden zu keinem Zeitpunkt zusätzliche HTTP-Anfragen an die Anbieter-IPs geschickt.

### Tests & Verifikation
- **Unit-Tests (`unit_core.py`):** 55+ Tests erfolgreich, 0 fehlgeschlagen.
- **Selbsttests (`selftest.py`):** 42 von 42 bestanden, 0 fehlgeschlagen.
- **Frontend-Validierung:** JavaScript-Syntax vollständig geprüft (`node --check`).
