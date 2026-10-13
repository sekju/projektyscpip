# Instrukcje Claude dla projektu SCPIP

Obowiązujące zasady projektu są w [AGENTS.md](AGENTS.md). Przeczytaj go w całości przed zmianami, a następnie [HANDOFF-SCPIP-EPARTNER.md](HANDOFF-SCPIP-EPARTNER.md) i `CODEX.md`, jeśli istnieje. Nie utrzymuj tutaj odrębnej, rozbieżnej kopii procedury.

Najważniejsze reguły:

- Produkcja SCPIP: `https://projekty.scpip.pl/`, repo `sekju/projektyscpip`, gałąź `main`, Pages z katalogu głównego. Gałąź `zalecenia_20250718` jest historyczna; prace `codex/*` integruj do `main`.
- Każda aktualizacja DDD wymaga w tym samym zadaniu aktualizacji, publikacji i kontroli `https://projekty.epartner24.pl/` (chyba że użytkownik zażądał pracy lokalnej).
- Źródło: sekcja `#droga-do-domu` w SCPIP i `docs/DDD_KAT*`. Strony epartner są generowane przez `scripts/export-epartner.ps1`; poprawki wykonuj w źródle/eksporterze.
- Eksporter nadpisuje i usuwa pliki w sąsiednich repozytoriach. Przed uruchomieniem sprawdź ścieżki i zabezpiecz lokalną pracę zgodnie z AGENTS.md.
- Uruchom eksport i `scripts/check-epartner-export.ps1`. Commit/push SCPIP na `main` uruchamia automatyczną synchronizację obu repozytoriów epartner; sprawdź zakończenie workflow, Pages i nowe pliki na produkcji.
- Nie uznawaj samego push SCPIP za zakończenie aktualizacji DDD. Nie uruchamiaj równolegle lokalnej publikacji i automatycznej synchronizacji.
- Zachowuj polskie znaki, standard opisów dokumentów i UTF-8 z BOM skryptów PowerShell. Nie deklaruj niepotwierdzonych wyników audytu WCAG.
- Przestrzegaj zasad delegowania, ochrony cudzych zmian i handoffu z AGENTS.md.
