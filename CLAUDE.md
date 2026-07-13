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

## Hosting i deployment

- **Platforma**: GitHub Pages (repo `sekju/projektyscpip`)
- **Galaz produkcyjna**: `main` — GitHub Pages deployuje ze zrodla `Deploy from a branch`, galaz `main`, folder `/(root)`. **Wszystkie zmiany, ktore maja trafic na produkcje, musza byc na `main`.**
- **Domena produkcyjna**: `projekty.scpip.pl` (subdomena scpip.pl) — zapisana w pliku `CNAME`. Uwaga: `projektyscpip.pl` (bez kropki) NIE istnieje.
- **DNS**: rekord CNAME `projekty.scpip.pl` -> `sekju.github.io` (bez proxy). To poprawna konfiguracja dla subdomeny.

### Praca z galeziami

- Galaz domyslna repo = `main`. Nie myl z `zalecenia_20250718` (stara galaz, nie idzie na produkcje).
- Galezie `codex/*` to prace z aplikacji Codex; po zakonczeniu integruj do `main` (merge), zeby zmiany trafily na produkcje.
- Po dodaniu harmonogramow/tresci: commit -> integracja do `main` -> push origin main -> GitHub Pages sam zbuduje i wdrozy.
