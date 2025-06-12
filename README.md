# Projekty Śląskiego Centrum Profilaktyki i Psychoterapii

## Struktura projektu

Strona została podzielona na następujące pliki i katalogi:

### Pliki główne
- `index.html` - główny plik HTML strony
- `css/styles.css` - arkusz stylów CSS
- `js/main.js` - plik JavaScript z funkcjonalnościami strony

### Katalogi

#### `media/`
Katalog na pliki multimedialne:
- `images/` - obrazy i loga używane na stronie
  - `kolory-pion-slaskie-rgb.png` - Logo Funduszy Europejskich dla Śląskiego
  - `kolory-pion-rzeczpospolita-polska-rgb.png` - Logo Rzeczpospolitej Polskiej
  - `kolory-pion-unia-europejska-rgb.png` - Logo Unii Europejskiej
  - `logo-scpip-1.png` - Logo Śląskiego Centrum Profilaktyki i Psychoterapii

#### `dokumenty/`
Katalog na dokumenty do pobrania, podzielony według projektów:

- `strefa-katowice/` - dokumenty dla projektu "Strefa Transformacji w Katowicach 2.0"
- `strefa-ruda/` - dokumenty dla projektu "Strefa Transformacji w Rudzie Śląskiej 2.0"
- `zwrotnica-katowice/` - dokumenty dla projektu "ZWROTNICA w Katowicach 2.0"
- `zwrotnica-ruda/` - dokumenty dla projektu "ZWROTNICA w Rudzie Śląskiej"
- `freedom/` - dokumenty dla projektu "freeDOM – mieszkanie treningowe"
- `praktykant/` - dokumenty dla projektu "Praktykant - doświadczenie na wagę złota"

## Zmiany wprowadzone

1. **Wydzielenie CSS** - wszystkie style przeniesione do osobnego pliku `css/styles.css`
2. **Dodanie JavaScript** - utworzony plik `js/main.js` z funkcjonalnościami:
   - Smooth scrolling dla nawigacji
   - Obsługa dostępności klawiatury
   - Śledzenie pobierania dokumentów
   - Obsługa błędów ładowania obrazów
3. **Zmiana linków** - wszystkie linki do obrazów i dokumentów wskazują na lokalne katalogi
4. **Uporządkowanie struktury** - logiczne rozdzielenie plików według typu i przeznaczenia

## Instrukcje instalacji

1. Skopiuj wszystkie pliki obrazów do katalogu `media/images/`
2. Skopiuj dokumenty PDF/Word do odpowiednich podkatalogów w `dokumenty/`
3. Otwórz plik `index.html` w przeglądarce

## Dostępność

Strona została zaprojektowana z myślą o dostępności:
- Semantyczny HTML
- Odpowiednie kontrasty kolorów
- Obsługa nawigacji klawiaturą
- Alternatywne teksty dla obrazów
- ARIA labels dla nawigacji

## Kontakt

Śląskie Centrum Profilaktyki i Psychoterapii
ul. Mikołowska 21, 40-067 Katowice

Biuro projektów SCPiP
ul. Ligocka 5, 40-570 Katowice