# Instrukcje instalacji plików multimedialnych i dokumentów

## Pliki do pobrania i umieszczenia

### 1. Obrazy (katalog `media/images/`)

Pobierz następujące obrazy z oryginalnej strony i umieść je w katalogu `media/images/`:

- **kolory-pion-slaskie-rgb.png**
  - Źródło: https://projektyslaskiecentrum.com/wp-content/uploads/2024/04/kolory-pion-slaskie-rgb.png
  - Opis: Logo Funduszy Europejskich dla Śląskiego

- **kolory-pion-rzeczpospolita-polska-rgb.png**
  - Źródło: https://projektyslaskiecentrum.com/wp-content/uploads/2024/04/kolory-pion-rzeczpospolita-polska-rgb.png
  - Opis: Logo Rzeczpospolitej Polskiej

- **kolory-pion-unia-europejska-rgb.png**
  - Źródło: https://projektyslaskiecentrum.com/wp-content/uploads/2024/04/kolory-pion-unia-europejska-rgb.png
  - Opis: Logo Unii Europejskiej

- **logo-scpip-1.png**
  - Źródło: https://projektyslaskiecentrum.com/wp-content/uploads/2024/05/logo-scpip-1.png
  - Opis: Logo Śląskiego Centrum Profilaktyki i Psychoterapii

### 2. Dokumenty

Umieść odpowiednie dokumenty PDF/Word w następujących katalogach:

#### `dokumenty/strefa-katowice/`
- formularz-rekrutacyjny.pdf
- regulamin-rekrutacji.pdf
- protokol-rekrutacyjny.pdf
- regulamin-rodo.pdf

#### `dokumenty/strefa-ruda/`
- formularz-rekrutacyjny.pdf
- regulamin-rekrutacji.pdf
- regulamin-rodo.pdf
- zgoda-na-wizerunek.pdf
- wzor-zaświadczenia.pdf
- suplement-do-formularza-rekrutacyjnego.pdf
- ankieta-badania-potrzeb-specjalnych.docx

#### `dokumenty/zwrotnica-katowice/`
- formularz-rekrutacyjny.pdf
- regulamin-rekrutacji.pdf
- klauzula-rodo.pdf
- katalog-instrumentow.pdf
- kwestionariusz-kwalifikacji.pdf
- deklaracja-uczestnictwa.pdf
- zgoda-rodo.pdf

#### `dokumenty/zwrotnica-ruda/`
- formularz-rekrutacyjny.pdf
- deklaracja-uczestnictwa.pdf
- regulamin-rekrutacji.pdf
- klauzula-rodo.pdf
- katalog-instrumentow.pdf
- kwestionariusz-kwalifikacji.pdf
- karta-kwalifikacji.pdf

#### `dokumenty/freedom/`
- reguly-dostepnosci.pdf
- formularz-rekrutacyjny.pdf
- klauzula-rodo-scpip.pdf
- zgoda-rodo-freedom.pdf

#### `dokumenty/praktykant/`
- formularz-rekrutacyjny.pdf
- regulamin-rekrutacji.pdf
- kwestionariusz-kwalifikacji.pdf
- klauzula-rodo.pdf
- katalog-instrumentow.pdf
- deklaracja-uczestnictwa.pdf
- zgoda-rodo.pdf

## Kroki instalacji

1. **Pobierz obrazy**
   ```bash
   # Utwórz katalog images jeśli nie istnieje
   mkdir -p media/images
   
   # Pobierz obrazy (przykład z wget lub curl)
   wget -O media/images/kolory-pion-slaskie-rgb.png "https://projektyslaskiecentrum.com/wp-content/uploads/2024/04/kolory-pion-slaskie-rgb.png"
   wget -O media/images/kolory-pion-rzeczpospolita-polska-rgb.png "https://projektyslaskiecentrum.com/wp-content/uploads/2024/04/kolory-pion-rzeczpospolita-polska-rgb.png"
   wget -O media/images/kolory-pion-unia-europejska-rgb.png "https://projektyslaskiecentrum.com/wp-content/uploads/2024/04/kolory-pion-unia-europejska-rgb.png"
   wget -O media/images/logo-scpip-1.png "https://projektyslaskiecentrum.com/wp-content/uploads/2024/05/logo-scpip-1.png"
   ```

2. **Umieść dokumenty**
   - Skopiuj wszystkie dokumenty PDF/Word do odpowiednich katalogów zgodnie z powyższą listą
   - Upewnij się, że nazwy plików są dokładnie takie jak w HTML

3. **Sprawdź działanie**
   - Otwórz plik `index.html` w przeglądarce
   - Sprawdź czy wszystkie obrazy się ładują
   - Przetestuj pobieranie dokumentów

## Uwagi

- Wszystkie ścieżki w HTML są relatywne do katalogu głównego projektu
- Nazwy plików muszą być dokładnie takie jak w kodzie HTML
- Jeśli jakiś plik nie istnieje, link będzie nieaktywny
- Obrazy mają obsługę błędów - jeśli się nie załadują, zostaną ukryte

## Testowanie

Po umieszczeniu wszystkich plików:
1. Otwórz `index.html` w przeglądarce
2. Sprawdź konsolę deweloperską pod kątem błędów
3. Przetestuj wszystkie linki do dokumentów
4. Sprawdź responsywność na różnych urządzeniach