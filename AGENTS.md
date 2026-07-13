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

GitHub Pages, domena: projektyscpip.pl (plik CNAME)

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

Nastepnie commit/push w `..\projekty-epartner` publikuje zmiany na `projekty.epartner24.pl`.
