
# Zasady Nazewnictwa Dokumentów i Aktualizacji Strony

## Struktura Folderów
- Wszystkie dokumenty projektu (PDF, DOCX itp.) są przechowywane w jednym katalogu: `docs/`.
- Folder `docs/` zawiera listę plików w `lista_plikow.txt` do łatwego śledzenia.

## Nazewnictwo Plików
- **Wzór nazwy pliku**: `NAZWA_PROJEKTU_SKROTMIEJSCOWOŚCI-Tytul_dokumentu_bez_polskich_znakow.ext`
  - **NAZWA_PROJEKTU**: Krótka nazwa projektu w UPPERCASE (np. freeDOM, Praktykant, STREFAT_KAT, STREFAT_RSL, ZWROTNICA_KAT, ZWROTNICA_RSL).
  - **SKROTMIEJSCOWOŚCI**: Skrót miasta (KAT dla Katowice, RSL dla Ruda Śląska).
  - **Tytul_dokumentu_bez_polskich_znakow**: Tytuł bez polskich znaków (ą->a, ć->c, ę->e, ł->l, ń->n, ó->o, ś->s, ź->z, ż->z), bez spacji (użyj _ lub -), w lowercase.
  - **ext**: Rozszerzenie pliku (np. .pdf, .docx).

- **Przykłady**:
  - Oryginał: `Harmonogram_freeDOM_-_mieszkanie_treningowe_HFW_FD_ 09_2025.pdf` → `freeDOM_KAT-Harmonogram_mieszkanie_treningowe_HFW_FD_09_2025.pdf`
  - Oryginał: `Harmonogram_Praktykant_wrzesień_2025.pdf` → `Praktykant_KAT-Harmonogram_wrzesien_2025.pdf`
  - Oryginał: `Harmonogram_Strefa_Transformacji_w_Katowicach_2.0_HFW_9_2025.pdf` → `STREFAT_KAT-Harmonogram_strefa_transformacji_w_katowicach_2_0_HFW_9_2025.pdf`
  - Oryginał: `Harmonogram_Strefa_Transformacji_w_Rudzie_Śląskiej_2.0_HFW_ST_RS_09_2025.pdf` → `STREFAT_RSL-Harmonogram_strefa_transformacji_w_rudzie_slaskiej_2_0_HFW_ST_RS_09_2025.pdf`
  - Oryginał: `Harmonogram_ZWROTNICA_-_integracja_na_dobrym_torze_w_Katowicach_wrzesień_2025.pdf` → `ZWROTNICA_KAT-Harmonogram_integracja_na_dobrym_torze_w_katowicach_wrzesien_2025.pdf`

- **Uwagi**:
  - Usuń duplikaty i konflikty nazw.
  - Dla istniejących plików w `docs/` (np. ZWROTNICA_KTW-...), dostosuj do wzoru jeśli potrzeba (np. KTW → KAT).
  - Przechowuj oryginalne nazwy w komentarzach HTML.

## Komentarze w HTML (index.html)
- Nad każdym linkiem do dokumentu (`<a href="...">`) dodaj komentarz HTML:
  ```
  <!-- OSTATNIA AKTUALIZACJA:RRRR.MM.DD-HH:MM-Oryginalna nazwa pliku: Oryginalny_Tytul.ext -->
  ```
  - **RRRR.MM.DD-HH:MM**: Data i czas ostatniej aktualizacji (format: Rok.Miesiąc.Dzień-Godzina:Minuta, np. 2025.09.11-10:28).
  - **Oryginalna nazwa pliku**: Pełna oryginalna nazwa pliku przed unifikacją.

- **Przykład w HTML**:
  ```
  <!-- OSTATNIA AKTUALIZACJA:2025.09.11-10:28-Oryginalna nazwa pliku: Harmonogram_freeDOM_-_mieszkanie_treningowe_HFW_FD_ 09_2025.pdf -->
  <div class="document-link-wrapper">
    <a href="docs/freeDOM_KAT-Harmonogram_mieszkanie_treningowe_HFW_FD_09_2025.pdf" target="_blank" aria-label="Harmonogram freeDOM wrzesień 2025 - PDF">Harmonogram freeDOM wrzesień 2025 - PDF</a>
  </div>
  ```

## Procedura Aktualizacji
1. Skopiuj/przenieś plik do `docs/` z nową nazwą.
2. Zaktualizuj ścieżki w `index.html` do `docs/nowa_nazwa.ext`.
3. Dodaj komentarz nad linkiem z datą aktualizacji i oryginalną nazwą.
4. Zaktualizuj `lista_plikow.txt` po zmianach (użyj `dir` w cmd).
5. Dla nowych plików z `ZZZ_PLIKI_DO_DODANIA/`, usuń z Git (gitignore już istnieje).

Ten plik służy jako przewodnik dla przyszłych zmian. Ostatnia aktualizacja tego pliku: 2025.09.11-10:28.