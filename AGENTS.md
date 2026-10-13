# projektyscpip.pl

Statyczna strona HTML dla Slaskiego Centrum Profilaktyki i Psychoterapii (SCPIP) prezentujaca 7 projektow unijnych.

## Struktura

- `index.html` - glowna strona (wszystkie projekty w jednym pliku)
- `docs/` - pliki PDF/DOCX do pobrania
- `ZZZ_PLIKI_DO_DODANIA/` - folder staging z nowymi plikami (w .gitignore)
- `css/`, `js/`, `media/` - zasoby frontendowe

## Projekty i prefiksy plikow

| Projekt | Prefiks | Sekcja HTML |
|---------|---------|-------------|
| Strefa Transformacji Katowice | `STREFAT_KAT` | `#strefa-katowice` |
| Strefa Transformacji Ruda Sl. | `STREFAT_RSL` | `#strefa-ruda` |
| ZWROTNICA Katowice | `ZWROTNICA_KAT` | `#zwrotnica-katowice` |
| ZWROTNICA Ruda Sl. | `ZWROTNICA_RSL` | `#zwrotnica-ruda` |
| freeDOM | `freeDOM_KAT` | `#freedom` |
| Praktykant | `Praktykant_KAT` | `#praktykant` |
| Droga do domu Katowice | `DDD_KAT` | `#droga-do-domu` |

## Nazewnictwo plikow

Format: `PREFIKS-tytul_bez_polskich_znakow.pdf`
Harmonogramy: `PREFIKS-harmonogram_form_wsparcia_MM_RRRR.pdf`
Szczegoly: `docs/nazewnictwo_dokumentow.md`

## Comiesiezna aktualizacja harmonogramow

Uzyj skilla `/update-harmonogramy RRRR.MM.DD` - kopiuje pliki z `ZZZ_PLIKI_DO_DODANIA/`, poprawia nazwy, aktualizuje HTML.

## Hosting

GitHub Pages, repo `sekju/projektyscpip`, gałąź `main`, katalog główny. Domena produkcyjna: `projekty.scpip.pl` (plik CNAME), z kropką po `projekty`. Nazwa repozytorium `projektyscpip` nie jest domeną.

## epartner24.pl / projekty.epartner24.pl

Osobna strona epartner jest generowana z tego repo przez `scripts/export-epartner.ps1`.

- `..\epartner` / repo `sekju/epartner24.pl` - domena glowna `epartner24.pl`, tylko minimalistyczna zaslepka z logo.
- `..\projekty-epartner` / repo `sekju/projekty.epartner24.pl` - subdomena `projekty.epartner24.pl`, strona projektu "Droga do domu".
- Zrodlem tresci projektu jest sekcja `#droga-do-domu` w `index.html` oraz dokumenty `docs/DDD_KAT*`.
- Strona projektowa ma wlasny tealowy akcent, pasek logotypow UE skopiowany ze SCPIP, widget dostepnosci i `pages/deklaracja-dostepnosci.html`.
- Deklaracja dostepnosci ma zawierac tylko prawdziwe, zweryfikowane informacje. Nie wpisywac pelnej/czesciowej zgodnosci ani wynikow audytu, jesli nie wykonano realnego audytu produkcyjnego.
- Skrypt i check zapisuj w UTF-8 z BOM, bo Windows PowerShell 5 moze inaczej psuc polskie znaki przy here-stringach.

Po zmianach uruchom:

```powershell
.\scripts\export-epartner.ps1
.\scripts\check-epartner-export.ps1
```

Publikację prowadzi workflow synchronizacji opisany poniżej; ręczny commit/push w repo docelowym jest ścieżką zastępczą.

## Obowiązkowa ciągłość pracy SCPIP i epartner

- Przy rozpoczęciu wątku przeczytaj ten plik, `CODEX.md` (jeśli istnieje), `docs/nazewnictwo_dokumentow.md` oraz `HANDOFF-SCPIP-EPARTNER.md`. Handoff opisuje stan z konkretnej daty; stan Git i produkcji sprawdzaj ponownie.
- Źródłem prawdy jest repo `sekju/projektyscpip`. Aktualizacja DDD obejmuje od razu stronę SCPIP ORAZ `projekty.epartner24.pl`, bez osobnego pytania o zgodę na synchronizację. Dotyczy treści, dokumentów, nazw/linków, wspólnych zasobów i eksportera. Jeśli użytkownik zastrzegł pracę lokalną, przygotuj i sprawdź oba wyniki bez publikacji.
- Treści DDD edytuj w `index.html` (`#droga-do-domu`), dokumenty w `docs/DDD_KAT*`. Wygląd i szablon epartner zmieniaj w `scripts/export-epartner.ps1`. Nie naprawiaj wyłącznie wygenerowanych plików docelowych: następny eksport je nadpisze.
- `epartner24.pl` to strona główna z logo i linkiem; właściwa strona DDD to `projekty.epartner24.pl`. Do epartner nie eksportuj pozostałych projektów SCPIP.

### Przygotowanie aktualizacji

1. Sprawdź branch, HEAD, remote i status wszystkich trzech repozytoriów, następnie aktualny stan zdalny. Produkcyjna gałąź to `main`; `zalecenia_20250718` jest historyczna. Prace `codex/*` integruj do `main` przed publikacją.
2. Chroń niezacommitowaną pracę. Eksporter zapisuje do katalogów sąsiednich: `..\epartner` i `..\projekty-epartner`. Sprawdź ich bezwzględne ścieżki i repozytoria. Eksport nadpisuje strony i zasoby, usuwa wszystkie pliki z docelowego `docs/`, a w apex usuwa stare `js/`, `docs/`, `pages/` i `css/epartner.css`. Przy cudzych zmianach użyj zabezpieczonej kopii lub izolowanych checkoutów z takim samym układem katalogów; nie uruchamiaj eksportu w ciemno.
3. Dla harmonogramów użyj skilla `update-harmonogramy`. Folder wskazany przez użytkownika ma pierwszeństwo przed schematem daty w skillu. Przeczytaj pierwszą stronę KAŻDEGO PDF-u: projekt, miesiąc i numer projektu. Treść PDF ma pierwszeństwo przed nazwą. Uwzględniaj wszystkie 7 projektów, w tym `DDD_KAT`, nawet jeśli starszy skill wymienia tylko 6.
4. Stosuj `PREFIKS-harmonogram_form_wsparcia_MM_RRRR.pdf`; zachowaj oryginały w stagingu i wcześniejsze harmonogramy. Zgłoś brakujące projekty i wyjaśnij niejednoznaczne dokumenty. Nie pytaj ponownie o już udzieloną zgodę na publikację ani rutynową korektę nazewnictwa.
5. Dodaj link we właściwej sekcji, widoczny format i rozmiar (KB zaokrąglone w górę), opisowy `aria-label` z rozwiniętymi skrótami oraz informacją o otwarciu/pobraniu. PDF: `target="_blank"`. Zachowaj polskie znaki, komentarz z datą i oryginalną nazwą, aktualizuj `docs/lista_plikow.txt`.

### Eksport, publikacja i kryterium zakończenia

Po zmianach treści lub zasobów wykonaj w bezpiecznie przygotowanym układzie repozytoriów:

```powershell
.\scripts\export-epartner.ps1
.\scripts\check-epartner-export.ps1
```

Sprawdź diff, wszystkie zmienione linki i pliki, zgodność SHA-256 dokumentów DDD w źródle i eksporcie oraz podstawowe działanie UI przy zmianach HTML/CSS/JS. Skrypty zachowaj jako UTF-8 z BOM. Check eksportu nie jest pełnym audytem dostępności; nie wpisuj niepotwierdzonych wyników ani zgodności WCAG.

Podstawowa ścieżka publikacji:

1. Commit wyłącznie plików zadania, integracja do `main`, push SCPIP. Bez `git add .` w zabrudzonym repozytorium; bez force-push.
2. Poczekaj na udane GitHub Pages SCPIP ORAZ workflow `.github/workflows/sync-epartner.yml` dla właściwego SHA. Workflow eksportuje i commit/pushuje oba repozytoria docelowe, jeśli mają zmiany.
3. Wymagane ustawienia SCPIP: `EPARTNER_REPOSITORY=sekju/epartner24.pl`, `EPARTNER_PROJECTS_REPOSITORY=sekju/projekty.epartner24.pl`, sekret `EPARTNER_REPO_TOKEN` z zapisem do obu repozytoriów. Brak zmiennych może dać pominięty job, co NIE potwierdza synchronizacji. Nie wypisuj wartości sekretów.
4. Sprawdź wdrożenie Pages docelowego repozytorium oraz produkcyjny HTML i pobieranie nowych dokumentów na `https://projekty.scpip.pl/` i `https://projekty.epartner24.pl/`. Gdy DDD nie zmieniło wyniku eksportu, potwierdź brak różnic zamiast wymagać sztucznego commita.
5. Jeżeli automatyzacja zawiedzie, sprawdź logi; napraw konfigurację lub po zakończeniu aktywnego workflow wykonaj kontrolowany commit/push wygenerowanych zmian w docelowych repozytoriach. Nie publikuj lokalnie i przez automat równocześnie. Ręczny eksport sam nie publikuje.
6. Raportuj osobno wynik SCPIP i epartner, SHA oraz ograniczenia. Aktualizacja DDD nie jest zakończona, gdy działa tylko SCPIP.

Workflow reaguje na `index.html`, `docs/DDD_KAT*`, `media/epartner-*`, `media/images/*`, `css/styles.css`, `js/main.js`, skrypty eksportu/check i własny plik; ma też `workflow_dispatch`. Nowe zależności eksportera dodawaj do filtrów workflow.

### Delegowanie i handoff

Deleguj wąskie, niezależne odczyty lub przeglądy: prostą inwentaryzację do dostępnego modelu Luna, złożoną analizę do Sol; Astrę wykorzystuj przy istotnych decyzjach architektonicznych. Jeden wykonawca mutuje dany worktree. Agent dostaje zakres, ograniczenia i wymagane dowody; nie zmyśla faktów i nie commit/pushuje bez polecenia orkiestratora. Wyniki weryfikuj przez źródła, diff i adekwatne kontrole.

Na zamknięcie sesji aktualizuj `HANDOFF-SCPIP-EPARTNER.md`: cel, decyzje, branch/SHA, lokalne zmiany i backupy, testy, osobno produkcja, procesy, pierwsze zadanie i zakazy powtarzania. Nie rozpoczynaj nowej implementacji w sesji zamykanej handoffem.
