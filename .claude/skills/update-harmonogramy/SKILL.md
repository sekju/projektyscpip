---
name: update-harmonogramy
description: Dodaje nowe harmonogramy form wsparcia do strony projektyscpip.pl. Kopiuje pliki PDF z folderu ZZZ_PLIKI_DO_DODANIA do docs/, poprawia nazewnictwo, aktualizuje index.html i tworzy commit. Uruchamiaj gdy trzeba dodac nowe harmonogramy na nowy miesiac.
argument-hint: [RRRR.MM.DD]
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Aktualizacja harmonogramow form wsparcia

Skill do dodawania nowych harmonogramow form wsparcia na stronie projektyscpip.pl.

## Argument

- `$ARGUMENTS` - data folderu z plikami, format: `RRRR.MM.DD` (np. `2026.03.06`)

Na podstawie daty ustal folder zrodlowy: `ZZZ_PLIKI_DO_DODANIA/RRRR.MM-pliki/` (np. dla `2026.03.06` -> `ZZZ_PLIKI_DO_DODANIA/2026.03-pliki/`).

## Projekty i prefiksy

| Projekt | Prefiks pliku | Sekcja HTML (id) |
|---------|---------------|------------------|
| Strefa Transformacji Katowice 2.0 | `STREFAT_KAT` | `strefa-katowice` |
| Strefa Transformacji Ruda Sl. 2.0 | `STREFAT_RSL` | `strefa-ruda` |
| ZWROTNICA Katowice 2.0 | `ZWROTNICA_KAT` | `zwrotnica-katowice` |
| ZWROTNICA Ruda Sl. | `ZWROTNICA_RSL` | `zwrotnica-ruda` |
| freeDOM mieszkanie treningowe | `freeDOM_KAT` | `freedom` |
| Praktykant | `Praktykant_KAT` | `praktykant` |

## Nazwy miesiecy po polsku

| MM | Nazwa |
|----|-------|
| 01 | styczen |
| 02 | luty |
| 03 | marzec |
| 04 | kwiecien |
| 05 | maj |
| 06 | czerwiec |
| 07 | lipiec |
| 08 | sierpien |
| 09 | wrzesien |
| 10 | pazdziernik |
| 11 | listopad |
| 12 | grudzien |

## Poprawny format nazwy pliku

```
PREFIKS-harmonogram_form_wsparcia_MM_RRRR.pdf
```

Gdzie:
- `PREFIKS` - dokladnie jeden z: `STREFAT_KAT`, `STREFAT_RSL`, `ZWROTNICA_KAT`, `ZWROTNICA_RSL`, `freeDOM_KAT`, `Praktykant_KAT`
- `-` - myslnik jako separator prefiksu od tytulu
- `harmonogram_form_wsparcia` - stala czesc nazwy
- `MM` - dwucyfrowy miesiac (np. `03`)
- `_` - separator miedzy miesiacem a rokiem
- `RRRR` - czterocyfrowy rok (np. `2026`)
- `.pdf` - jedno rozszerzenie

**Przyklad poprawnej nazwy**: `STREFAT_KAT-harmonogram_form_wsparcia_03_2026.pdf`

## Procedura krok po kroku

### 1. Walidacja plikow zrodlowych

Wylistuj zawartosc folderu `ZZZ_PLIKI_DO_DODANIA/RRRR.MM-pliki/`.

Sprawdz KAZDY plik pod katem ponizszych regul walidacji. Plik jest poprawny TYLKO jesli spelnia WSZYSTKIE reguly.

#### Weryfikacja zawartosci PDF (OBOWIAZKOWA)

**ZAWSZE czytaj pierwsza strone kazdego pliku PDF** przed walidacja nazwy. Ludzie popelniaja bledy w nazwach plikow, a zawartosc PDF jest zrodlem prawdy.

Szukaj na pierwszej stronie:
- **Tytul projektu** (np. "Strefa Transformacji w Katowicach 2.0") - pozwala przypisac plik do wlasciwego projektu
- **Nazwa harmonogramu / miesiac** (np. "MARZEC 2026") - pozwala zweryfikowac miesiac
- **Nr projektu** (np. "FESL.10.24-IZ.01-03E0/23-003") - dodatkowe potwierdzenie

Jesli zawartosc PDF jest sprzeczna z nazwa pliku, zawartosc PDF ma priorytet. Na przyklad: plik o nazwie `STREFA_KAT_RSL-...` ale w PDF jest "Strefa Transformacji w Katowicach 2.0" -> to plik dla STREFAT_KAT.

#### Reguly walidacji nazwy pliku

| # | Regula | Przyklad bledu | Poprawna wersja |
|---|--------|----------------|-----------------|
| 1 | **Prefiks musi byc dokladnie jednym z 6 dozwolonych** | `FREEDOM-...` | `freeDOM_KAT-...` |
| 2 | **Prefiks musi miec poprawna wielkosc liter** | `freedom_kat-...` | `freeDOM_KAT-...` |
| 3 | **Prefiks musi zawierac skrot miejscowosci (_KAT lub _RSL)** | `PRAKTYKANT-...` | `Praktykant_KAT-...` |
| 4 | **Prefiks NIE moze laczyc dwoch lokalizacji** | `STREFA_KAT_RSL-...` | Blad! Nie wiadomo czy to KAT czy RSL. Pytaj uzytkownika. |
| 5 | **Rozszerzenie musi byc pojedyncze `.pdf`** | `...pdf.pdf` | `...pdf` |
| 6 | **Miesiac i rok musza byc rozdzielone `_`** | `...032026.pdf` | `...03_2026.pdf` |
| 7 | **Miesiac musi byc dwucyfrowy** | `...3_2026.pdf` | `...03_2026.pdf` |
| 8 | **Nazwa nie moze zawierac sufiksu `(1)`, `(2)` itp.** | `...022026 (1).pdf` | Blad! Plik pobrany wielokrotnie - moze byc duplikatem. Pytaj uzytkownika. |
| 9 | **Miesiac w nazwie musi odpowiadac folderowi** | Plik z `02_2026` w folderze `2026.03-pliki` | Blad! Plik z innego miesiaca. Pytaj uzytkownika czy to zaleglosc. |
| 10 | **Separator prefiksu to `-` (myslnik)** | `STREFAT_KAT_harmonogram...` | `STREFAT_KAT-harmonogram...` |

#### Generowanie raportu walidacji

Po sprawdzeniu wszystkich plikow wygeneruj raport w formacie:

```
=== RAPORT WALIDACJI PLIKOW ===
Folder: ZZZ_PLIKI_DO_DODANIA/RRRR.MM-pliki/
Znaleziono plikow: N

--- PLIKI POPRAWNE ---
  (brak) lub lista plikow ktore przeszly walidacje

--- PLIKI Z BLEDAMI ---

1. PLIK_ZRODLOWY
   Bledy:
   - [regula #1] Nieprawidlowy prefiks "FREEDOM" - brak skrotu miejscowosci
   - [regula #5] Podwojne rozszerzenie .pdf.pdf
   - [regula #6] Brak separatora _ miedzy miesiacem a rokiem
   Proponowana nazwa: freeDOM_KAT-harmonogram_form_wsparcia_03_2026.pdf

2. STREFA_KAT_RSL-harmonogram_form_wsparcia_032026.pdf.pdf
   Bledy:
   - [regula #4] BLOKUJACY: Prefiks laczy dwie lokalizacje (KAT + RSL).
     Nie mozna automatycznie okreslic ktorego projektu dotyczy ten plik.
   - [regula #5] Podwojne rozszerzenie .pdf.pdf
   - [regula #6] Brak separatora _ miedzy miesiacem a rokiem
   WYMAGANA DECYZJA UZYTKOWNIKA:
   a) To jest plik dla STREFAT_KAT -> STREFAT_KAT-harmonogram_form_wsparcia_03_2026.pdf
   b) To jest plik dla STREFAT_RSL -> STREFAT_RSL-harmonogram_form_wsparcia_03_2026.pdf
   c) To jest plik dla obu (skopiuj jako dwa pliki)
   d) Pomin ten plik

3. ZWROTNICA_RSL-harmonogram_form_wsparcia_022026.pdf (1).pdf
   Bledy:
   - [regula #8] BLOKUJACY: Sufiks "(1)" - plik pobrany wielokrotnie
   - [regula #9] BLOKUJACY: Miesiac 02 nie odpowiada folderowi 03
   - [regula #5] Podwojne rozszerzenie .pdf.pdf
   - [regula #6] Brak separatora _ miedzy miesiacem a rokiem
   WYMAGANA DECYZJA UZYTKOWNIKA:
   a) To zaleglosc z lutego -> dodaj jako ZWROTNICA_RSL-harmonogram_form_wsparcia_02_2026.pdf
   b) To pomylka - pomin ten plik

=== PODSUMOWANIE ===
Poprawne: X plikow (gotowe do dodania)
Z bledami naprawialnymi automatycznie: Y plikow
Wymagajace decyzji uzytkownika: Z plikow
```

#### Kategorie bledow

- **Naprawialny automatycznie** - bledy #1, #2, #3, #5, #6, #7, #10. System proponuje poprawna nazwe.
- **BLOKUJACY - wymaga decyzji** - bledy #4, #8, #9. System NIE MOZE kontynuowac bez odpowiedzi uzytkownika. Pokaz opcje do wyboru.

### 2. Decyzja uzytkownika

Pokaz raport walidacji uzytkownikowi.

**STOP - nie kontynuuj bez odpowiedzi uzytkownika!**

Jesli sa bledy blokujace, czekaj na decyzje dla KAZDEGO takiego pliku.
Jesli sa tylko bledy naprawialne, pokaz proponowane nazwy i zapytaj: "Czy kontynuowac z proponowanymi nazwami?"

### 3. Kopiowanie plikow do docs/

Dopiero po zatwierdzeniu przez uzytkownika kopiuj pliki z poprawionymi nazwami.

```bash
cp "ZZZ_PLIKI_DO_DODANIA/RRRR.MM-pliki/PLIK_ZRODLOWY" "docs/PLIK_DOCELOWY"
```

Po skopiowaniu zweryfikuj:
```bash
ls -la docs/*harmonogram_form_wsparcia_MM_RRRR*
```

### 4. Sprawdzenie brakujacych projektow

Porownaj liste plikow zatwierdzonych do dodania z pelna lista 6 projektow.
Jesli dla jakiegos projektu brakuje harmonogramu na dany miesiac, poinformuj uzytkownika:

```
UWAGA: Brak harmonogramu na NAZWA_MIESIACA RRRR dla:
- Praktykant_KAT
Czy to jest zamierzone?
```

### 5. Aktualizacja index.html

Dla kazdego projektu dodaj nowy link w odpowiedniej sekcji HTML. Nowe linki dodawaj **przed zamknieciem sekcji `</section>`**, po ostatnim istniejacym linku harmonogramu.

#### Wzor linku HTML (zgodny z WCAG 2.1)

```html
            <div class="document-link-wrapper"><a href="docs/PREFIKS-harmonogram_form_wsparcia_MM_RRRR.pdf"
                    target="_blank"
                    aria-label="Harmonogram Form Wsparcia - NAZWA_MIESIACA RRRR - PDF (ROZMIAR KB) - otworzy się w nowej karcie">Harmonogram
                    Form Wsparcia - NAZWA_MIESIACA RRRR - PDF (ROZMIAR KB)</a></div>
```

Zamien:
- `PREFIKS` na prefiks projektu (np. `STREFAT_KAT`)
- `MM_RRRR` na miesiac i rok (np. `03_2026`)
- `NAZWA_MIESIACA` na polska nazwe miesiaca (np. `marzec`)
- `RRRR` na rok (np. `2026`)
- `ROZMIAR` na rozmiar pliku w KB (zaokraglony w gore)

#### Wymogi WCAG 2.1 dla linkow do plikow

Kazdy link do pliku do pobrania MUSI zawierac:

1. **Rozmiar pliku** - w tekście widocznym i w `aria-label`, format: `(XXX KB)`
   - Pobierz rozmiar: `stat -c%s plik.pdf` i przelicz na KB: `(bajty + 1023) / 1024`
2. **Format pliku** - widoczny w tekscie (np. `- PDF`, `- WORD`)
3. **aria-label** - pelny opis: tytul + format + rozmiar + informacja o otwarciu
   - Dla PDF: `"... - PDF (XXX KB) - otworzy się w nowej karcie"`
   - Dla DOCX: `"... - WORD (XXX KB) - zostanie pobrany"`
4. **target="_blank"** - dla plikow PDF (otwieraja sie w nowej karcie)

**NIGDY nie dodawaj linku bez rozmiaru pliku!** Sprawdz rozmiar poleceniem `stat` po skopiowaniu do `docs/`.

#### Lokalizacja w HTML

Wyszukaj ostatni link `harmonogram_form_wsparcia` w kazdej sekcji projektu i dodaj nowy link zaraz po nim, przed `</section>`.

Sekcje do aktualizacji:
- `<section id="strefa-katowice">` - STREFAT_KAT
- `<section id="strefa-ruda">` - STREFAT_RSL (linki sa w czesci "Dodatkowe dokumenty")
- `<section id="zwrotnica-katowice">` - ZWROTNICA_KAT
- `<section id="zwrotnica-ruda">` - ZWROTNICA_RSL
- `<section id="freedom">` - freeDOM_KAT
- `<section id="praktykant">` - Praktykant_KAT (linki sa w czesci "Dodatkowe dokumenty")

### 6. Weryfikacja

Po wszystkich zmianach:

1. **Sprawdz pliki**: Upewnij sie, ze wszystkie pliki PDF sa w `docs/`
2. **Sprawdz HTML**: Przeczytaj index.html i zweryfikuj poprawnosc linkow
3. **Sprawdz spójnosc**: Kazdy plik w docs/ powinien miec odpowiadajacy link w HTML
4. **Pokaz podsumowanie**: Wypisz liste dodanych plikow i zmodyfikowanych sekcji

### 7. Commit i push

Zapytaj uzytkownika czy chce wykonac commit. Jesli tak:

```
git add docs/PREFIKS-harmonogram_form_wsparcia_MM_RRRR.pdf
git add index.html
git commit -m "Dodano harmonogramy form wsparcia na NAZWA_MIESIACA RRRR dla N projektow"
```

Nastepnie zapytaj o push na GitHub.

## Uwagi

- Folder `ZZZ_PLIKI_DO_DODANIA/` jest w `.gitignore` - pliki zrodlowe nie sa commitowane
- Pliki docelowe w `docs/` sa trackowane przez git
- Nie usuwaj plikow zrodlowych z `ZZZ_PLIKI_DO_DODANIA/` - sluza jako backup
- W sekcjach STREFAT_RSL i Praktykant linki harmonogramow sa pod naglowkiem `<h4>Dodatkowe dokumenty</h4>`
- Wielkosc liter w prefiksach jest wazna: `freeDOM_KAT` (nie `FREEDOM_KAT`), `Praktykant_KAT` (nie `PRAKTYKANT_KAT`)
