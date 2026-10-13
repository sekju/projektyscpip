# Aktualizacja końcowa: 2026-10-13 — harmonogramy i adres biura

Ta sekcja zastępuje wcześniejszy stan poniżej; starsze informacje o backupach pozostają ważne.

## Wykonane zadanie i decyzje

- Źródło: `docs/UPLOAD`, 5 PDF na październik 2026. Pierwsze strony odczytano i wyrenderowano. Dodano DDD, freeDOM, Praktykant oraz Zwrotnica Katowice/Ruda. Nie dostarczono obu Stref Transformacji. Zachowano oryginały i wcześniejsze harmonogramy.
- freeDOM, Praktykant i Zwrotnica Katowice mają oznaczenie WYDRUK TESTOWY; użytkownik zlecił aktualizację tymi plikami. Zgłoszono to w raporcie i wiadomości do klienta.
- Dodano DDD: 792 377 809, 791 671 258, drogadodomu.katowice@gmail.com, klikalne tel/mailto.
- Zgodnie z poleceniem „wszędzie” adres SCPIP i biura w HTML zmieniono na ul. Mikołowska 20, 40-067 Katowice, również wcześniejszą siedzibę Mikołowska 21. Zadano opcjonalne doprecyzowanie tego rozróżnienia; do publikacji nie otrzymano odpowiedzi. Siedziba EPARTNER w Tychach i biura Rudy Śląskiej pozostają odrębne.
- Stare opisy cech Ligockiej i Mikołowskiej 21 zastąpiono informacją o oczekiwaniu na potwierdzenie dostępności nowego lokalu. Nie przypisano nowemu biuru windy/podjazdu/toalety ani zgodności WCAG. DDD dostało opis i kontakt w źródle; deklaracja epartner dostała odsyłacz do nich w eksporterze.
- Zaktualizowano także stopkę i adres w publicznym `pages/deklaracja-dostepnosci-old.html`, aby nie publikować starego adresu.

## Git i produkcja

- SCPIP `main`: commit treści `65269b78cde2fe9ebc18b51aa0820e73999cf3cb`; niniejszy handoff stanowi kolejny commit dokumentacyjny (odczytaj aktualny HEAD).
- SCPIP Pages `38381299933` — success dla tego SHA.
- Sync epartner `38381300599` — success; job i kroki wykonane, nie pominięte. Obie zmienne repo i nazwa sekretu potwierdzone bez ujawniania wartości sekretu.
- Projekty epartner `main = origin/main = c4f65d58a9e08c27f07fbbfc34acdc7ab3814401`; Pages `38381324306` — success.
- Apex `main = origin/main = 1609aae104bcc9fad9e3f0d6ada7c2fef6cfb411`; eksport bez zmian treści, brak nowego commita oczekiwany.
- Produkcja obu stron: HTTP 200, nowe telefony, e-mail, Mikołowska 20, aktualna informacja dostępności; 5 nowych PDF z SCPIP i DDD z epartner pobrane i porównane SHA-256 z lokalnymi plikami — zgodne.

## Weryfikacja i stan lokalny

- Eksport i check przeszły. Sprawdzono wszystkie linki docs w obu indexach, rozmiary/formaty/aria-label nowych harmonogramów, SHA-256 wszystkich DDD oraz brak Ligockiej/Mikołowskiej 21 w indexach.
- Edge headless: desktop 1280 i mobile 390, działanie paneli nawigacji/dostępności, zwiększanie tekstu, Escape, brak błędów JS i poziomego przepełnienia. Zrzuty mobilne przejrzane. To kontrola podstawowa, nie pełny audyt WCAG.
- Diff sprawdzono z `core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol`, ponieważ źródłowy index ma CRLF; bez błędów. PowerShell exporter zachował UTF-8 BOM.
- Oba targety po eksporcie porównano z wynikiem workflow (normalizacja BOM/EOL); zgodne. Zabezpieczono wygenerowaną pracę i wykonano fast-forward lokalnych targetów. Są czyste.
- Nowe backupy: apex stash `add7940fe98b62b4b8db0c0802e541932df259f2`; projekty stash `3f60b35cfdf11229de7c932de31d8dcc21a1455f` i `11e74fa5a655af231cf43d6aa406b8466c4eea0c`. Pierwszy stash projektów zapisał kopię, lecz nie usunął chronionych katalogów `.agents/`, `tests/`; osobny stash tracked umożliwił fast-forward. Nie stosować starych stashów automatycznie.
- Zachowano cudze `.agents/`, `fixes/`, `docs/rozliczenie-2026-04-09.md` i staging `docs/UPLOAD/`. `tmp/pdfs/` zawiera zrzuty QA i `address-documents.json` z inwentaryzacją. Nie dodawać tych ścieżek zbiorczo do Git.
- Brak działających serwerów i procesów zadania. Sandbox ma błąd inicjalizacji; używano zatwierdzonych poleceń poza nim. Agent Luna wykonał wyłącznie odczyt lokalizacji i opisów dostępności.

## Do uzupełnienia przez zleceniodawcę / pierwsze następne zadanie

Pozyskać potwierdzony opis Mikołowskiej 20: wejście i dojście, kondygnacja/numer lokalu, schody/progi, podjazd/platforma/winda, szerokości przejść, toaleta, miejsca parkingowe, pies asystujący, pomoc na miejscu, godziny i kontakt. Uzupełnić sekcje dostępności Strefy Katowice, Zwrotnicy Katowice, freeDOM, Praktykanta, DDD oraz deklaracje SCPIP i epartner.

W dokumentach do pobrania pozostaje Ligocka: klauzule RODO freeDOM (PDF/DOCX) i Praktykant (DOCX); regulamin i wizerunek Strefy Katowice (PDF/DOCX); klauzula i zgoda RODO pod Strefą Ruda (DOCX); klauzula i regulamin Zwrotnicy Katowice (DOCX); klauzula Zwrotnicy Ruda (DOCX, dodatkowy PDF bez linku). Pozyskać zatwierdzone aktualne wersje; historycznych harmonogramów nie przerabiać. Nie edytowano formalnych PDF/DOCX ani ich archiwów.

Nie importować ponownie październikowych PDF, nie naprawiać DNS, nie powtarzać publikacji już wdrożonej treści i nie przywracać stashów. Przy kolejnej zmianie DDD ponownie publikować i weryfikować obie strony.

---

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
