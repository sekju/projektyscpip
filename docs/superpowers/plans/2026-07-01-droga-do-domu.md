# Droga do domu - dodanie projektu na projektyscpip.pl Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the new project "Droga do domu. Kompleksowe wsparcie osób w kryzysie bezdomności" (Katowice, prefix `DDD_KAT`) to `index.html` as the 7th project, and document the new prefix in `CLAUDE.md` and `docs/nazewnictwo_dokumentow.md`.

**Architecture:** Static HTML site, single `index.html` file with one `<section>` per project plus a shared `<nav>` and `#o-projektach` overview list. No build step, no test runner — this repo has no `package.json`. Verification is done via `grep`/`git grep` structural checks (id uniqueness, presence/absence) instead of an automated test suite.

**Tech Stack:** Plain HTML/CSS/JS, GitHub Pages hosting, Markdown docs.

## Global Constraints

- The client-supplied project text must be reproduced **word-for-word** — no paraphrasing, shortening, or merging sentences (see `docs/superpowers/specs/2026-07-01-droga-do-domu-design.md` and memory `feedback_verbatim_client_text`).
- Section `id`: `droga-do-domu`. Heading `id`: `droga-do-domu-heading`.
- Prefix code: `DDD_KAT`.
- No Kontakt / Dostępność architektoniczna / Dokumenty rekrutacyjne subsections for now — intentionally out of scope until that data is available.
- No changes to the `#strefa-katowice` or `#strefa-ruda` sections in this plan.
- Follow the exact HTML block already validated in the spec — copy it verbatim, do not re-derive wording from the raw client text again.

---

### Task 1: Add navigation link and `#o-projektach` list entry

**Files:**
- Modify: `index.html:134` (nav list, after the Praktykant `<li>`)
- Modify: `index.html:150` (`#o-projektach` list, after the Praktykant `<li>`)

**Interfaces:**
- Produces: nav link `href="#droga-do-domu"` that Task 2's new `<section id="droga-do-domu">` must satisfy.

- [ ] **Step 1: Verify the link doesn't exist yet**

Run: `grep -n "droga-do-domu\|Droga do domu" index.html`
Expected: no output (no matches)

- [ ] **Step 2: Add the nav link**

In `index.html`, the nav `<ul>` currently ends with:

```html
                <li><a href="#freedom">freeDOM – mieszkanie treningowe</a></li>
                <li><a href="#praktykant">Praktykant - doświadczenie na wagę złota</a></li>
            </ul>
        </div>
    </nav>
```

Change it to:

```html
                <li><a href="#freedom">freeDOM – mieszkanie treningowe</a></li>
                <li><a href="#praktykant">Praktykant - doświadczenie na wagę złota</a></li>
                <li><a href="#droga-do-domu">Droga do domu</a></li>
            </ul>
        </div>
    </nav>
```

- [ ] **Step 3: Add the `#o-projektach` list entry**

The `#o-projektach` section list currently ends with:

```html
                <li>"freeDOM – mieszkanie treningowe"</li>
                <li>"Praktykant - doświadczenie na wagę złota"</li>
            </ul>
        </section>
```

Change it to:

```html
                <li>"freeDOM – mieszkanie treningowe"</li>
                <li>"Praktykant - doświadczenie na wagę złota"</li>
                <li>"Droga do domu. Kompleksowe wsparcie osób w kryzysie bezdomności"</li>
            </ul>
        </section>
```

- [ ] **Step 4: Verify both insertions landed**

Run: `grep -n "droga-do-domu\|Droga do domu" index.html`
Expected: 2 matching lines — one `<li><a href="#droga-do-domu">Droga do domu</a></li>` line in the nav, one `<li>"Droga do domu...` line in `#o-projektach`.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: dodaj Droga do domu do nawigacji i listy projektow"
```

---

### Task 2: Add the "Droga do domu" project section

**Files:**
- Modify: `index.html:903-905` (insert new `<section>` between the closing `</section>` of `#praktykant` and the closing `</main>`)

**Interfaces:**
- Consumes: nav link `href="#droga-do-domu"` and `#o-projektach` entry from Task 1.
- Produces: `<section id="droga-do-domu">` — final section on the page, matching the structural pattern of the other 6 sections (`<section id aria-labelledby>`, `<h2 id>`, content, no Kontakt/Dostępność/Dokumenty).

- [ ] **Step 1: Verify the section doesn't exist yet**

Run: `grep -n 'id="droga-do-domu"' index.html`
Expected: no output

- [ ] **Step 2: Insert the new section**

`index.html` currently ends the `<main>` content with:

```html
                    Form Wsparcia - czerwiec 2026 - PDF (215 KB)</a></div>
        </section>

    </main>
```

Change it to (new section inserted between the closing `</section>` of Praktykant and `</main>`):

```html
                    Form Wsparcia - czerwiec 2026 - PDF (215 KB)</a></div>
        </section>

        <section id="droga-do-domu" aria-labelledby="droga-do-domu-heading">
            <h2 id="droga-do-domu-heading">Droga do domu. Kompleksowe wsparcie osób w kryzysie bezdomności</h2>
            <p>„Droga do domu. Kompleksowe wsparcie osób w kryzysie bezdomności” to projekt, którego głównym celem
                jest poprawa sytuacji osób w kryzysie bezdomności, dotkniętych wykluczeniem z dostępu do mieszkań lub
                zagrożonych bezdomnością poprzez rozwój i zwiększenie dostępności usług społecznych świadczonych w
                środowisku lokalnym.</p>
            <p>Działania projektu ukierunkowane są na zapewnienie kompleksowego, zindywidualizowanego wsparcia
                odpowiadającego na różne etapy kryzysu bezdomności – od profilaktyki i interwencji, po stabilizację i
                reintegrację społeczną.</p>
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
                <li>Utworzenie i funkcjonowanie mieszkań z usługami dla kobiet w kryzysie bezdomności lub zagrożonych
                    bezdomnością (funkcja interwencyjna);</li>
                <li>Funkcjonowanie mieszkań ze wsparciem w modelu „Housing First – Najpierw Mieszkanie”,
                    umożliwiających stabilizację życiową i proces usamodzielniania;</li>
                <li>Wzmocnienie kompetencji kadry, poprzez szkolenia (m.in. z dialogu motywacyjnego) oraz
                    superwizję.</li>
            </ul>
            <p>Grupę docelową stanowi co najmniej 150 osób w kryzysie bezdomności lub zagrożonych bezdomnością (w tym
                kobiety i mężczyźni) oraz 12 osób kadry świadczącej usługi społeczne, zamieszkujących lub
                przebywających na terenie Katowic.</p>
            <p>Realizacja projektu przyczyni się do: zwiększenia dostępu do usług społecznych, poprawy funkcjonowania
                społecznego uczestników, wzmocnienia samodzielności i poczucia sprawczości, ograniczenia skali
                zjawiska bezdomności, rozwoju usług zgodnych z ideą deinstytucjonalizacji.</p>
            <p>Projekt odpowiada na realne potrzeby osób w kryzysie bezdomności, uwzględniając również specyficzną
                sytuację kobiet oraz różnorodność ścieżek wychodzenia z kryzysu.</p>
            <p>Projekt realizowany jest w okresie 01.04.2026 – 30.06.2029 na terenie miasta Katowice.</p>
            <p>Projekt realizowany w partnerstwie z EPARTNER Kursy Językowe spółka z ograniczoną odpowiedzialnością.
            </p>
            <h3>Metadane Projektu</h3>
            <ul>
                <li><strong>Okres realizacji:</strong> 01.04.2026 – 30.06.2029</li>
                <li><strong>Miejsce realizacji:</strong> Katowice</li>
                <li><strong>Partner:</strong> EPARTNER Kursy Językowe spółka z ograniczoną odpowiedzialnością</li>
                <li><strong>Wartość projektu:</strong> 5 059 954,00 zł</li>
                <li><strong>Dofinansowanie:</strong> 4 806 956,30 zł</li>
            </ul>
        </section>

    </main>
```

- [ ] **Step 3: Verify structure**

Run: `grep -c '<section id=' index.html`
Expected: `8` (7 project sections + `#o-projektach`)

Run: `grep -n 'id="droga-do-domu"' index.html`
Expected: exactly 1 match (the `<section id="droga-do-domu"`)

Run: `grep -c "droga-do-domu-heading" index.html`
Expected: `2` (the `aria-labelledby="droga-do-domu-heading"` on the `<section>` and the `id="droga-do-domu-heading"` on the `<h2>`)

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: dodaj sekcje projektu Droga do domu"
```

---

### Task 3: Update `CLAUDE.md` prefix table

**Files:**
- Modify: `CLAUDE.md:3` (project count in intro sentence)
- Modify: `CLAUDE.md:12-21` (prefixes table)

- [ ] **Step 1: Verify the row doesn't exist yet**

Run: `grep -n "DDD_KAT" CLAUDE.md`
Expected: no output

- [ ] **Step 2: Update the project count and add the table row**

`CLAUDE.md` currently has:

```markdown
Statyczna strona HTML dla Slaskiego Centrum Profilaktyki i Psychoterapii (SCPIP) prezentujaca 6 projektow unijnych.
```

Change to:

```markdown
Statyczna strona HTML dla Slaskiego Centrum Profilaktyki i Psychoterapii (SCPIP) prezentujaca 7 projektow unijnych.
```

And the table:

```markdown
| Projekt | Prefiks | Sekcja HTML |
|---------|---------|-------------|
| Strefa Transformacji Katowice | `STREFAT_KAT` | `#strefa-katowice` |
| Strefa Transformacji Ruda Sl. | `STREFAT_RSL` | `#strefa-ruda` |
| ZWROTNICA Katowice | `ZWROTNICA_KAT` | `#zwrotnica-katowice` |
| ZWROTNICA Ruda Sl. | `ZWROTNICA_RSL` | `#zwrotnica-ruda` |
| freeDOM | `freeDOM_KAT` | `#freedom` |
| Praktykant | `Praktykant_KAT` | `#praktykant` |
```

Change to:

```markdown
| Projekt | Prefiks | Sekcja HTML |
|---------|---------|-------------|
| Strefa Transformacji Katowice | `STREFAT_KAT` | `#strefa-katowice` |
| Strefa Transformacji Ruda Sl. | `STREFAT_RSL` | `#strefa-ruda` |
| ZWROTNICA Katowice | `ZWROTNICA_KAT` | `#zwrotnica-katowice` |
| ZWROTNICA Ruda Sl. | `ZWROTNICA_RSL` | `#zwrotnica-ruda` |
| freeDOM | `freeDOM_KAT` | `#freedom` |
| Praktykant | `Praktykant_KAT` | `#praktykant` |
| Droga do domu Katowice | `DDD_KAT` | `#droga-do-domu` |
```

- [ ] **Step 3: Verify**

Run: `grep -n "DDD_KAT\|7 projektow" CLAUDE.md`
Expected: 2 matches — the intro sentence with "7 projektow" and the new table row with `DDD_KAT`.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: dodaj DDD_KAT do tabeli prefiksow projektow"
```

---

### Task 4: Update `docs/nazewnictwo_dokumentow.md`

**Files:**
- Modify: `docs/nazewnictwo_dokumentow.md:10` (NAZWA_PROJEKTU example list)
- Modify: `docs/nazewnictwo_dokumentow.md:99` (last-updated date footer)

- [ ] **Step 1: Verify the prefix isn't documented yet**

Run: `grep -n "DDD_KAT" docs/nazewnictwo_dokumentow.md`
Expected: no output

- [ ] **Step 2: Add `DDD_KAT` to the example list**

Current line:

```markdown
  - **NAZWA_PROJEKTU**: Krótka nazwa projektu w UPPERCASE (np. freeDOM, Praktykant, STREFAT_KAT, STREFAT_RSL, ZWROTNICA_KAT, ZWROTNICA_RSL).
```

Change to:

```markdown
  - **NAZWA_PROJEKTU**: Krótka nazwa projektu w UPPERCASE (np. freeDOM, Praktykant, STREFAT_KAT, STREFAT_RSL, ZWROTNICA_KAT, ZWROTNICA_RSL, DDD_KAT).
```

- [ ] **Step 3: Update the footer date**

Current line:

```markdown
Ten plik służy jako przewodnik dla przyszłych zmian. Ostatnia aktualizacja tego pliku: 2026.03.31.
```

Change to:

```markdown
Ten plik służy jako przewodnik dla przyszłych zmian. Ostatnia aktualizacja tego pliku: 2026.07.01.
```

- [ ] **Step 4: Verify**

Run: `grep -n "DDD_KAT\|Ostatnia aktualizacja tego pliku" docs/nazewnictwo_dokumentow.md`
Expected: 2 matches — the updated example list line and the updated footer date line.

- [ ] **Step 5: Commit**

```bash
git add docs/nazewnictwo_dokumentow.md
git commit -m "docs: dodaj DDD_KAT do wytycznych nazewnictwa dokumentow"
```

---

### Task 5: Final verification

**Files:** none (read-only verification)

- [ ] **Step 1: Confirm all 4 file changes are committed**

Run: `git log --oneline -5`
Expected: 4 new commits on top of the spec commits (Task 1–4 commit messages, most recent first).

Run: `git status`
Expected: `nothing to commit, working tree clean`

- [ ] **Step 2: Confirm the page has no duplicate ids introduced**

Run: `grep -oE 'id="[a-z0-9-]+"' index.html | sort | uniq -d`
Expected: no output (no duplicate `id` attributes anywhere on the page)

- [ ] **Step 3: Open the page locally and check the new section renders and the nav link scrolls to it**

Run: `start index.html` (Windows — opens the file in the default browser)

Manually confirm:
- "Droga do domu" appears in the top nav and in the `#o-projektach` list
- Clicking the nav link jumps to the new section
- The new section's heading, task list (with nested bullets), and "Metadane Projektu" block render correctly with no broken HTML (no visible stray tags/text)
