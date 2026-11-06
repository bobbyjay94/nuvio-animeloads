# Claude Übergabebericht — Onyx Merge v46 (2026.11.06.08)

## Problemstellung
Der Nutzer meldete:
> "Diese selbsterstellte Kategorie ist zwar als eingeblendet gezeigt, aber in der Vorschau ist sie nicht eingeblendet. Diese Kategorie ist leer. Aber ich möchte ja, wenn sie eingeblendet wird, dann dort auch angezeigt wird, auch wenn nichts darin ist."
Screenshot zeigte im Editor die selbsterstellte Kategorie `[E] --- KABEL & PAY-TV ---` (Original: `--- SPORT ---`), `0 Einträge`, Schalter `sichtbar` aktiviert. In der Vorschau (`#pv`) und den Kunden-Playlists fehlte die Kategorie jedoch komplett.

## Ursachenanalyse (Root Cause)
1. **Berechnung von `c["provs"]` in `build_view()`**:
   - Für jede Kategorie werden die darin enthaltenen Anbieter berechnet:
     `c["provs"] = sorted({o["_p"] for o in items.get(c["vid"], []) if not o.get("_hide")})`
   - Hat eine Kategorie keine Sender (oder alle Sender sind ausgeblendet), ist `c["provs"] == []`.
2. **Filterung in `visible_cats()`**:
   - `visible_cats()` filterte bisher mit:
     `if c["show"] and set(c["provs"]) & set(pset)`
   - Für eine leere Kategorie war `set(c["provs"])` immer die leere Menge `set()`. Dadurch ergab die Schnittmenge mit `set(pset)` stets `False`.
   - Folge: Die Kategorie wurde aus `visible_cats` entfernt und fehlte somit in `/api/preview`, in der Xtream Codes API (`list_categories` / `get_live_categories`) sowie im M3U-Export.
   - Der ursprüngliche Sinn dieser Prüfung war, ungenutzte/leere Kategorien aus den Provider-Katalogen A und B auszublenden. Bei manuell erstellten eigenen Kategorien (`pkey == "C"`) führte dies jedoch dazu, dass neu angelegte Kategorien oder Trennzeilen unsichtbar blieben.

## Durchgeführte Änderungen
1. **Backend (`onyx_merge.py`)**:
   - `visible_cats` erweitert:
     ```python
     return [c for c in V().get(kind, {}).get("cats", []) if c["show"]
             and (set(c["provs"]) & set(pset) or (c.get("pkey") == "C" and not c["provs"] and bool(pset)))
             and (allow is None or f"{kind}:{c['vid']}" in allow)]
     ```
   - Eigene leere Kategorien (`c.get("pkey") == "C" and not c["provs"]`) bleiben für alle Benutzer mit aktiven Providern (`bool(pset)`) sichtbar, solange `c["show"]` auf `True` steht.
   - Leere Provider-Kategorien (`pkey != "C"`) bleiben weiterhin ausgefiltert.
   - Version erhöht auf `2026.11.06.08` mit Changelog-Eintrag.
2. **Frontend (`admin.html`)**:
   - In `loadPreview()`: Wenn eine Kategorie angewählt wird (`pvCat`) und keine Sender enthält, zeigt die Vorschau nun konsistent `Diese Kategorie ist leer.` anstelle von `Hier sieht dieser Benutzer nichts.`.
3. **Tests (`tests/unit_core.py`)**:
   - Unit-Test hinzugefügt für Erhalt von leeren selbsterstellten Kategorien in `visible_cats`, `/api/preview` (mit `count: 0`), leere Senderabfrage ohne Fehler und Auslieferung über Xtream Codes `list_categories`.

## Verifikationsergebnis
- Python-Kompilierung: Fehlerfrei.
- JS-Syntaxprüfung: Fehlerfrei.
- 70 Unit-Tests: 0 Fehler.
- 5 Gruppierungstests: 0 Fehler.
- 42 Selftests: 42 bestanden, 0 Fehler.
- Keine externen Provider-Anfragen.
