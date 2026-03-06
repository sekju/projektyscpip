# projektyscpip.pl

Statyczna strona HTML dla Slaskiego Centrum Profilaktyki i Psychoterapii (SCPIP) prezentujaca 6 projektow unijnych.

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

## Nazewnictwo plikow

Format: `PREFIKS-tytul_bez_polskich_znakow.pdf`
Harmonogramy: `PREFIKS-harmonogram_form_wsparcia_MM_RRRR.pdf`
Szczegoly: `docs/nazewnictwo_dokumentow.md`

## Comiesiezna aktualizacja harmonogramow

Uzyj skilla `/update-harmonogramy RRRR.MM.DD` - kopiuje pliki z `ZZZ_PLIKI_DO_DODANIA/`, poprawia nazwy, aktualizuje HTML.

## Hosting

GitHub Pages, domena: projektyscpip.pl (plik CNAME)
