# epartner24.pl - design synchronizacji

## Cel

Powstaje osobna strona `epartner24.pl` dla projektu "Droga do domu. Kompleksowe wsparcie osob w kryzysie bezdomnosci". Strona ma byc samodzielnym bytem produkcyjnym, ale jej tresc projektowa i dokumenty maja aktualizowac sie z repo `projektyscpip` tylko wtedy, gdy zmienia sie zakres dotyczacy projektu "Droga do domu".

## Decyzja architektoniczna

Tworzymy osobny lokalny projekt:

`C:\Users\piotr\OneDrive\0_SKUTECZNY.MARKETING\KLIENCI\SCPIP 2025\Strona WWW\PROJEKTY.SCPIP.PL\epartner`

Projekt dostanie osobne repo GitHub, osobny GitHub Pages i osobny plik `CNAME` z wartoscia `epartner24.pl`.

Repo `projektyscpip` pozostaje zrodlem prawdy dla wspolnej czesci danych projektu. Nie kopiujemy calej strony recznie i nie laczymy produkcji. Zamiast tego dodajemy eksport, ktory generuje strone epartner z wybranych fragmentow:

- sekcja `#droga-do-domu`,
- dokumenty `docs/DDD_KAT*`,
- logo i branding epartner,
- statyczne zasoby potrzebne do dzialania strony epartner.

## Zakres synchronizacji

Synchronizacja epartner moze reagowac na zmiany w `index.html`, ale sam eksport musi porownywac wygenerowany wynik. Dzieki temu zmiana innego projektu na stronie SCPIP nie powinna tworzyc zmian w repo epartner, jesli wynik dla "Droga do domu" pozostaje taki sam.

Preferowany trigger automatyczny:

- `index.html`,
- `docs/DDD_KAT*`,
- `media/epartner-*`,
- skrypt eksportu,
- konfiguracja GitHub Actions odpowiedzialna za eksport.

## Branding

Strona epartner zachowuje prostote i strukture informacyjna strony SCPIP, ale uzywa wlasnego logo oraz palety:

- ciemny teal jako kolor glowny,
- zielony akcent dla elementow aktywnych i linkow,
- ciemny neutralny tekst na jasnym tle.

Pierwszy wariant logo zostal zapisany w `media/epartner-logo-concept.png`.

Kolorystyka musi byc sprawdzana pod WCAG 2.2 AA: kontrast tekstu, widoczne focus states, czytelne linki bez polegania wylacznie na kolorze oraz brak ukrywania tresci przy responsywnym ukladzie.

## Repo epartner

Repo epartner powinno zawierac tylko gotowa strone produkcyjna:

- `index.html`,
- `css/`,
- `js/`,
- `media/`,
- `docs/`,
- `CNAME`,
- `README.md`.

Nie powinno zawierac pozostalych projektow SCPIP ani stagingu `ZZZ_PLIKI_DO_DODANIA`.

## Aktualizacja

Docelowy przeplyw:

1. Aktualizacja projektu "Droga do domu" w repo SCPIP.
2. Commit i push do repo SCPIP.
3. GitHub Action uruchamia eksport epartner.
4. Jesli wygenerowany wynik rozni sie od aktualnego repo epartner, action commituje i pushuje zmiany do repo epartner.
5. GitHub Pages publikuje `epartner24.pl`.

## Otwarte decyzje wdrozeniowe

- Nazwa repo GitHub dla epartner, np. `epartner24.pl` albo `epartner24`.
- Czy GitHub Action ma od razu pushowac do `main` repo epartner, czy tworzyc pull request.
- Czy domena `epartner24.pl` ma wskazywac na apex GitHub Pages oraz czy skonfigurujemy rowniez `www.epartner24.pl`.
