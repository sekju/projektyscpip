# Dodanie projektu "Droga do domu" na projektyscpip.pl

## Kontekst

Do portfolio SCPIP dołącza nowy projekt: "Droga do domu. Kompleksowe wsparcie
osób w kryzysie bezdomności" (Katowice, prefiks kodowy `DDD_KAT`). Strona
`index.html` prezentuje obecnie 6 projektów w jednym pliku HTML, każdy jako
osobna sekcja z linkiem w nawigacji. Trzeba dodać siódmy projekt, zachowując
istniejący wzorzec strukturalny.

Równolegle dwa istniejące projekty ("Strefa Transformacji w Katowicach 2.0" i
"Strefa Transformacji w Rudzie Śląskiej 2.0") kończą etap, w którym dodawane są
harmonogramy form wsparcia. To nie wymaga żadnej zmiany na stronie teraz —
tylko odnotowania na przyszłość (przy kolejnych `/update-harmonogramy` te dwa
projekty należy pomijać).

## Zakres

1. Nowa sekcja projektu w `index.html` (treść, nawigacja górna, lista w
   `#o-projektach`).
2. Aktualizacja tabeli prefiksów w `CLAUDE.md`.
3. Aktualizacja `docs/nazewnictwo_dokumentow.md` o nowy prefiks `DDD_KAT`.

Poza zakresem (świadomie pominięte na tę chwilę, do uzupełnienia gdy dane będą
znane): sekcja Kontakt, adres biura projektu, opis dostępności architektonicznej,
sekcja Dokumenty/harmonogramy (brak plików PDF na razie).

## Projekt sekcji HTML

Wzorzec zaczerpnięty z istniejących sekcji (`#freedom`, `#praktykant` itd.):
`<section id="..." aria-labelledby="...-heading">`, `<h2>` z `id`, akapity
wstępne, podsekcje `<h3>`, blok „Metadane Projektu” jako `<ul>`.

- **Umiejscowienie:** na końcu `<main>`, po sekcji `#praktykant` (ostatni
  projekt w kolejności = najnowszy).
- **`id` sekcji:** `droga-do-domu`
- **Nawigacja:** nowy `<li><a href="#droga-do-domu">Droga do domu</a></li>`
  na końcu listy w `<nav>` (linia ok. 134-135 w obecnym pliku).
- **Lista `#o-projektach`:** dopisanie
  `<li>"Droga do domu. Kompleksowe wsparcie osób w kryzysie bezdomności"</li>`
  do istniejącej listy 6 projektów.

### Struktura treści sekcji

- `<h2 id="droga-do-domu-heading">Droga do domu. Kompleksowe wsparcie osób w
  kryzysie bezdomności</h2>`
- Akapit wstępny: cel projektu (poprawa sytuacji osób w kryzysie bezdomności,
  dotkniętych wykluczeniem z dostępu do mieszkań lub zagrożonych bezdomnością)
  + zdanie o zindywidualizowanym wsparciu na różnych etapach kryzysu
  (profilaktyka, interwencja, stabilizacja, reintegracja).
- `<h3>Główne zadania projektu</h3>` — `<ul>` z 5 pozycjami z treści
  źródłowej, z zagnieżdżonymi `<ul>` przy zadaniu 1 (usługi profilaktyczne/
  interwencyjno-aktywizujące) i zadaniu 2 (punkt informacyjno-konsultacyjny),
  zgodnie z podpunktami podanymi przez klienta.
- `<h3>Grupa docelowa</h3>` — akapit: min. 150 osób w kryzysie bezdomności lub
  zagrożonych bezdomnością (kobiety i mężczyźni) oraz 12 osób kadry usług
  społecznych, teren Katowic.
- `<h3>Metadane Projektu</h3>` — `<ul>`:
  - Okres realizacji: 01.04.2026 – 30.06.2029
  - Miejsce realizacji: Katowice
  - Partner: EPARTNER Kursy Językowe spółka z ograniczoną odpowiedzialnością
  - Wartość projektu: 5 059 954,00 zł
  - Dofinansowanie: 4 806 956,30 zł
- `<h3>Cel i rezultaty projektu</h3>` — akapit o efektach: zwiększenie
  dostępu do usług społecznych, poprawa funkcjonowania społecznego, wzmocnienie
  samodzielności, ograniczenie skali bezdomności, rozwój usług zgodnych z ideą
  deinstytucjonalizacji; dopasowanie do potrzeb kobiet i różnorodnych ścieżek
  wychodzenia z kryzysu.

Brak sekcji `accessibility-info`, `contact-info` i „Dokumenty rekrutacyjne” —
zostaną dodane, gdy dane będą dostępne.

## Dokumentacja pomocnicza

### `CLAUDE.md`

Nowy wiersz w tabeli „Projekty i prefiksy plikow”:

```
| Droga do domu Katowice | `DDD_KAT` | `#droga-do-domu` |
```

### `docs/nazewnictwo_dokumentow.md`

Dopisanie `DDD_KAT` do listy przykładowych `NAZWA_PROJEKTU` (linia 10, obok
`freeDOM, Praktykant, STREFAT_KAT, STREFAT_RSL, ZWROTNICA_KAT, ZWROTNICA_RSL`).
Aktualizacja daty „Ostatnia aktualizacja tego pliku” na dole dokumentu.

## Poza zakresem tej zmiany

- Żadna zmiana na stronie dla „Strefa Transformacji w Katowicach 2.0” i
  „Strefa Transformacji w Rudzie Śląskiej 2.0” — tylko wewnętrzna notatka, że
  te dwa projekty nie otrzymują już nowych harmonogramów.
- Sekcje Kontakt / Dostępność architektoniczna / Dokumenty dla „Droga do domu”
  — do dodania w osobnej, przyszłej aktualizacji, gdy dane będą znane.
