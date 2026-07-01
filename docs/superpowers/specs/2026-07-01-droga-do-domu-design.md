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

**Zasada nadrzędna: cały tekst dostarczony przez klienta jest przenoszony
słowo w słowo, w oryginalnej kolejności i z oryginalną interpunkcją.** Nie
parafrazujemy, nie skracamy, nie łączymy zdań w streszczenia. Jedyne dodane
elementy to znaczniki strukturalne (`<h2>`, `<h3>Metadane Projektu</h3>`,
podział na `<p>`/`<ul>`) potrzebne do osadzenia treści we wzorcu strony —
same słowa klienta się nie zmieniają.

Dokładne odwzorowanie tekstu źródłowego na HTML:

```html
<h2 id="droga-do-domu-heading">Droga do domu. Kompleksowe wsparcie osób w kryzysie bezdomności</h2>

<p>„Droga do domu. Kompleksowe wsparcie osób w kryzysie bezdomności” to projekt, którego głównym celem jest poprawa sytuacji osób w kryzysie bezdomności, dotkniętych wykluczeniem z dostępu do mieszkań lub zagrożonych bezdomnością poprzez rozwój i zwiększenie dostępności usług społecznych świadczonych w środowisku lokalnym.</p>

<p>Działania projektu ukierunkowane są na zapewnienie kompleksowego, zindywidualizowanego wsparcia odpowiadającego na różne etapy kryzysu bezdomności – od profilaktyki i interwencji, po stabilizację i reintegrację społeczną.</p>

<h3>Cel projektu zostanie zrealizowany poprzez główne zadania projektowe:</h3>
<ul>
    <li>Usługi o charakterze profilaktycznym oraz interwencyjno-aktywizującym, w tym:
        <ul>
            <li>wsparcie pracownika socjalnego,</li>
            <li>działania streetworkerów,</li>
            <li>wsparcie asystenta osoby w kryzysie bezdomności;</li>
        </ul>
    </li>
    <li>Funkcjonowanie punktu informacyjno-konsultacyjnego, obejmujące:
        <ul>
            <li>wsparcie doradców pierwszego kontaktu,</li>
            <li>poradnictwo specjalistyczne,</li>
            <li>działania grup samopomocowych,</li>
            <li>mobilne punkty pomocy przedmedycznej,</li>
            <li>działania wspierające integrację ze społecznością lokalną;</li>
        </ul>
    </li>
    <li>Utworzenie i funkcjonowanie mieszkań z usługami dla kobiet w kryzysie bezdomności lub zagrożonych bezdomnością (funkcja interwencyjna);</li>
    <li>Funkcjonowanie mieszkań ze wsparciem w modelu „Housing First – Najpierw Mieszkanie”, umożliwiających stabilizację życiową i proces usamodzielniania;</li>
    <li>Wzmocnienie kompetencji kadry, poprzez szkolenia (m.in. z dialogu motywacyjnego) oraz superwizję.</li>
</ul>

<p>Grupę docelową stanowi co najmniej 150 osób w kryzysie bezdomności lub zagrożonych bezdomnością (w tym kobiety i mężczyźni) oraz 12 osób kadry świadczącej usługi społeczne, zamieszkujących lub przebywających na terenie Katowic.</p>

<p>Realizacja projektu przyczyni się do: zwiększenia dostępu do usług społecznych, poprawy funkcjonowania społecznego uczestników, wzmocnienia samodzielności i poczucia sprawczości, ograniczenia skali zjawiska bezdomności, rozwoju usług zgodnych z ideą deinstytucjonalizacji.</p>

<p>Projekt odpowiada na realne potrzeby osób w kryzysie bezdomności, uwzględniając również specyficzną sytuację kobiet oraz różnorodność ścieżek wychodzenia z kryzysu.</p>

<p>Projekt realizowany jest w okresie 01.04.2026 – 30.06.2029 na terenie miasta Katowice.</p>

<p>Projekt realizowany w partnerstwie z EPARTNER Kursy Językowe spółka z ograniczoną odpowiedzialnością.</p>

<h3>Metadane Projektu</h3>
<ul>
    <li><strong>Okres realizacji:</strong> 01.04.2026 – 30.06.2029</li>
    <li><strong>Miejsce realizacji:</strong> Katowice</li>
    <li><strong>Partner:</strong> EPARTNER Kursy Językowe spółka z ograniczoną odpowiedzialnością</li>
    <li><strong>Wartość projektu:</strong> 5 059 954,00 zł</li>
    <li><strong>Dofinansowanie:</strong> 4 806 956,30 zł</li>
</ul>
```

Uwaga: „Metadane Projektu” to dodatkowe, skanowalne podsumowanie faktów już
obecnych w tekście powyżej (okres, partner, wartość, dofinansowanie) — spójne
z konwencją pozostałych 6 sekcji na stronie. Nie zastępuje pełnego akapitu,
tylko go uzupełnia.

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
