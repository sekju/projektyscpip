# Handoff: aktualizacje SCPIP i DDD / epartner

Data: 2026-10-13. Ten dokument jest stanem przekazania, nie dowodem przyszłego stanu produkcji.

## Cel i ustalenia

Kolejny wątek aktualizuje stronę SCPIP na podstawie nowych plików użytkownika. Każda zmiana projektu Droga do domu (DDD) obejmuje od razu eksport, publikację i weryfikację `projekty.epartner24.pl`. Nie trzeba osobnej zgody na epartner, gdy użytkownik zleca publikację aktualizacji DDD. Zastrzeżenie pracy lokalnej obowiązuje obie strony.

Przeczytaj `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, jeśli powstanie, oraz `docs/nazewnictwo_dokumentow.md`. W chwili przekazania CODEX.md nie istniał. AGENTS.md zawiera pełną procedurę; CLAUDE.md odsyła do niej i powtarza reguły krytyczne.

## Repozytoria, gałęzie i integracja

Katalog roboczy: `C:\Users\piotr\OneDrive\0_SKUTECZNY.MARKETING\KLIENCI\SCPIP 2025\Strona WWW\PROJEKTY.SCPIP.PL\projektyscpip`. Bez nowego worktree; gałąź `main`.

| Repo | Lokalizacja | Stan treści przy przekazaniu |
|---|---|---|
| sekju/projektyscpip | katalog bieżący | bazowy HEAD `4ce8dc2f84cca33bc31b3cd63dc8742fcac18010`; instrukcje/handoff są osobną porcją dokumentacyjną, jej SHA odczytaj przez `git log -1` |
| sekju/epartner24.pl | `..\epartner` | main = origin/main = `1609aae104bcc9fad9e3f0d6ada7c2fef6cfb411` |
| sekju/projekty.epartner24.pl | `..\projekty-epartner` | main = origin/main = `aca50061c115ed9eb41659d462939ecb6e0d9628` |

Na polecenie użytkownika oba repozytoria epartner zintegrowano fast-forward i wykonano `git push origin main`: oba zwróciły `Everything up-to-date`. Nie było rozbieżnych commitów wymagających merge commita. Wszystkie lokalne pliki śledzone odpowiadały zdalnemu main po normalizacji BOM/końców linii; treść była już opublikowana. Oba katalogi są czyste po integracji.

## Zachowana wcześniejsza praca

Nie kasuj kopii ani nie stosuj całych stashów automatycznie, bo odtworzą starszy stan już zintegrowanych plików.

- Apex: stash `5cbbd36edfd01289ff1c7134c79b408a45230cd6`, opis `handoff-2026-10-13-before-main-sync`.
- Projekty: stash `1dfa8d10a2ff744e49d17224fd8a8550e9111adf`, opis `handoff-2026-10-13-before-main-sync`. Zawiera wcześniejsze zmiany i nieśledzone pliki, w tym `tests/a11y-theme-css.test.js` oraz dokumenty DDD. Dokumenty DDD są już śledzone w main. Test pozostał w kopii, nie został dodany do produkcji ani uruchomiony w tej sesji; wymaga osobnej oceny przy przyszłych pracach nad dostępnością.
- Projekty: stash `21742e310075642dd80b6d79b8d0fbd106cf3f57`, opis `handoff-2026-10-13-tracked-before-main-sync`.
- Pierwszy stash projektów zapisał kopię, lecz zwrócił błąd przy usuwaniu pustych/chronionych katalogów. Zbadano stan, wykonano dodatkowy stash zmian śledzonych i dopiero potem poprawny fast-forward. Nie wykonywano reset --hard ani clean.
- W SCPIP pozostają cudze/niezwiązane nieśledzone ścieżki: `.agents/`, `fixes/`, `docs/rozliczenie-2026-04-09.md`. Nie dodawaj ich zbiorczo do commita.

## Źródła i publikacja

Źródło DDD: `index.html`, sekcja `#droga-do-domu`, dokumenty `docs/DDD_KAT*`. Generator: `scripts/export-epartner.ps1`; kontrola: `scripts/check-epartner-export.ps1`. Skrypty muszą zachować UTF-8 z BOM. Eksporter pisze do obu sąsiednich repozytoriów i usuwa stare pliki docelowe; przed uruchomieniem stosuj zabezpieczenia opisane w AGENTS.md.

Podstawowa ścieżka: zmiana SCPIP → eksport/check → commit/integracja/push main SCPIP → `Sync epartner24.pl` → Pages obu właściwych stron → kontrola dokumentów online. Automat pushuje zmienione wyniki do repozytoriów docelowych. Nie uruchamiaj w tym samym czasie ręcznej publikacji targetów.

Workflow: `.github/workflows/sync-epartner.yml`. Wymaga dwóch zmiennych `EPARTNER_REPOSITORY`, `EPARTNER_PROJECTS_REPOSITORY` i sekretu `EPARTNER_REPO_TOKEN`. Brak zmiennych może pominąć job. Nie zapisuj kluczy API w repo/handoffie. Nie zmieniaj DNS przy zwykłej aktualizacji treści.

## Wykonane aktualizacje i kontrole

- We wrześniu dodano 5 harmonogramów: DDD, freeDOM, Praktykant, ZWROTNICA Katowice i Ruda Śląska; nie dostarczono plików obu Stref Transformacji. Nie dodawaj ich ponownie.
- Synchronizacja obejmuje także wspólny CSS, JS i logotypy; deklaracja epartner nie zawiera już nieudokumentowanego wyniku audytu 90%.
- Ta sesja zmienia wyłącznie dokumentację SCPIP i porządkuje integrację istniejącej zawartości epartner. Nie rozpoczyna październikowej aktualizacji harmonogramów.
- Po integracji: `scripts/check-epartner-export.ps1` zakończył się sukcesem. Sprawdzono semantyczną zgodność lokalnych plików z origin/main oraz diff dokumentacji. Nie uruchamiano ponownie destrukcyjnego eksportu ani pełnego audytu UI/WCAG.
- We wrześniu sprawdzono podstawowe działanie paneli, nawigacji, rozmiaru tekstu i widok mobilny; to dowód historyczny, nie aktualny pełny audyt.

## Produkcja — sprawdzona osobno 2026-10-13

- `https://projekty.scpip.pl/`: HTTP 200. Poprawna domena ma kropkę po `projekty`.
- `https://epartner24.pl/`: HTTP 200 z prawidłowym HTTPS.
- `https://www.epartner24.pl/`: przekierowanie do `https://epartner24.pl/`, wynik HTTP 200. Dawny problem www/HTTPS jest rozwiązany; nie powtarzaj napraw DNS.
- `https://projekty.epartner24.pl/`: HTTP 200.
- Wrześniowy PDF `DDD_KAT-harmonogram_form_wsparcia_09_2026.pdf` pobrany z SCPIP i epartner jest bajtowo identyczny z plikiem źródłowym.
- Odczytane ostatnie wdrożenia treści: SCPIP Pages run `35470484999`, sync `35470486381`, projekty epartner Pages `35470499227` — wszystkie success (19.09.2026). Te numery nie potwierdzają żadnej przyszłej publikacji.

## Pierwsze zadanie kolejnego wątku

1. Odczytaj instrukcje i wykonaj `git status -sb`, `git log -1`, `git remote -v` oraz fetch/status w trzech repozytoriach; nie nadpisuj nowych zmian.
2. Ustal wskazany przez użytkownika folder nowych plików. Przy inwentaryzacji tej sesji nie było katalogu październikowego w stagingu; ponownie sprawdź aktualny stan. Nie zakładaj, że `2026-09` zawiera nowe pliki do ponownej publikacji.
3. Zweryfikuj PDF-y według skilla `update-harmonogramy`, także DDD (7. projekt). Zaktualizuj SCPIP, a dla DDD zakończ dopiero po potwierdzeniu aktualizacji epartner.

## Agenci, procesy i ograniczenia

W tej sesji agent Luna wykonał wyłącznie odczyt eksportera, checka i workflow; orkiestrator zweryfikował wnioski. Jeden wykonawca mutował repozytoria. W przyszłych zadaniach deleguj wąskie odczyty/przeglądy; agenci nie commit/pushują bez zlecenia.

Nie uruchomiono serwera podglądu ani procesu długotrwałego wymagającego zatrzymania. Sandbox poleceń zgłaszał błąd inicjalizacji; użyto zatwierdzonych poleceń poza sandboxem. Nie traktuj tego jako dowodu uszkodzenia projektu.

Nie powtarzaj importu wrześniowych PDF-ów, napraw DNS ani wdrażania starych stashów. Nie edytuj tylko wygenerowanej strony DDD, nie twórz niepotwierdzonych deklaracji WCAG, nie ogłaszaj powodzenia epartner na podstawie samego push SCPIP.
