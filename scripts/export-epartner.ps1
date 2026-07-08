$ErrorActionPreference = 'Stop'

$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$ApexTarget = [System.IO.Path]::GetFullPath((Join-Path $Root '..\epartner'))
$ProjectsTarget = [System.IO.Path]::GetFullPath((Join-Path $Root '..\projekty-epartner'))

foreach ($Target in @($ApexTarget, $ProjectsTarget)) {
    if (-not (Test-Path -LiteralPath $Target)) {
        New-Item -ItemType Directory -Force -Path $Target | Out-Null
    }
}

foreach ($Folder in @('css', 'js', 'media', 'media\images', 'docs', 'pages')) {
    New-Item -ItemType Directory -Force -Path (Join-Path $ProjectsTarget $Folder) | Out-Null
}

foreach ($Folder in @('css', 'media')) {
    New-Item -ItemType Directory -Force -Path (Join-Path $ApexTarget $Folder) | Out-Null
}

foreach ($StalePath in @(
    (Join-Path $ApexTarget 'js'),
    (Join-Path $ApexTarget 'docs'),
    (Join-Path $ApexTarget 'pages'),
    (Join-Path $ApexTarget 'css\epartner.css')
)) {
    if (Test-Path -LiteralPath $StalePath) {
        Remove-Item -LiteralPath $StalePath -Recurse -Force
    }
}

Set-Content -LiteralPath (Join-Path $ApexTarget 'CNAME') -Encoding UTF8 -Value 'epartner24.pl'
Set-Content -LiteralPath (Join-Path $ProjectsTarget 'CNAME') -Encoding UTF8 -Value 'projekty.epartner24.pl'

$Readme = @'
# projekty.epartner24.pl

Statyczna strona projektu "Droga do domu" dla domeny projekty.epartner24.pl.

Zawartosc jest generowana z repo projektyscpip przez `scripts/export-epartner.ps1`.

## Publikacja

Repo powinno dzialac jako osobny projekt GitHub Pages z domena `projekty.epartner24.pl`.

Po utworzeniu repo GitHub:

```powershell
git remote add origin https://github.com/sekju/projekty.epartner24.pl.git
git push -u origin main
```

W repo `projektyscpip` automatyczna synchronizacja wymaga:

- sekretu `EPARTNER_REPO_TOKEN` z prawem zapisu do tego repo,
- zmiennej `EPARTNER_REPOSITORY` ustawionej na `sekju/projekty.epartner24.pl`.
'@
Set-Content -LiteralPath (Join-Path $ProjectsTarget 'README.md') -Encoding UTF8 -Value $Readme

$ApexReadme = @'
# epartner24.pl

Minimalna strona startowa domeny epartner24.pl.

Docelowa strona projektow znajduje sie pod adresem https://projekty.epartner24.pl/.
'@
Set-Content -LiteralPath (Join-Path $ApexTarget 'README.md') -Encoding UTF8 -Value $ApexReadme

$SourceHtmlPath = Join-Path $Root 'index.html'
$SourceHtml = Get-Content -LiteralPath $SourceHtmlPath -Raw -Encoding UTF8
$SectionMatch = [regex]::Match($SourceHtml, '(?s)<section id="droga-do-domu"[^>]*>.*?</section>')
if (-not $SectionMatch.Success) {
    throw 'Could not find #droga-do-domu section'
}

$ProjectSection = $SectionMatch.Value

$ProjectSection = $ProjectSection -replace '<h3>Metadane Projektu</h3>', '<h3>Metadane projektu</h3>'
$ProjectSection = $ProjectSection -replace '<h3>Cel projektu zostanie zrealizowany poprzez główne zadania projektowe:</h3>', '<h3 id="cel-projektu">Cel projektu zostanie zrealizowany poprzez główne zadania projektowe:</h3>'
$ProjectSection = $ProjectSection -replace '<h3>Metadane projektu</h3>', '<h3 id="metadane-projektu">Metadane projektu</h3>'

$LogoSource = Join-Path $Root 'media\epartner-logo-concept.png'
if (-not (Test-Path -LiteralPath $LogoSource)) {
    throw 'Missing media/epartner-logo-concept.png'
}
Copy-Item -LiteralPath $LogoSource -Destination (Join-Path $ApexTarget 'media\epartner-logo.png') -Force
Copy-Item -LiteralPath $LogoSource -Destination (Join-Path $ProjectsTarget 'media\epartner-logo.png') -Force

$JsSource = Join-Path $Root 'js\main.js'
if (Test-Path -LiteralPath $JsSource) {
    Copy-Item -LiteralPath $JsSource -Destination (Join-Path $ProjectsTarget 'js\main.js') -Force
}

$EpartnerNavJs = @'
document.addEventListener('DOMContentLoaded', function () {
    const navPanelList = document.getElementById('nav-panel-list');
    if (!navPanelList) return;

    [
        { href: '#cel-projektu', label: 'Cel projektu' },
        { href: '#metadane-projektu', label: 'Metadane projektu' }
    ].forEach((item) => {
        if (!document.querySelector(item.href) || navPanelList.querySelector(`a[href="${item.href}"]`)) return;

        const li = document.createElement('li');
        li.className = 'nav-panel-subitem';
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        li.appendChild(a);
        navPanelList.appendChild(li);
    });
});
'@
Set-Content -LiteralPath (Join-Path $ProjectsTarget 'js\epartner-nav.js') -Encoding UTF8 -Value $EpartnerNavJs

$SharedCssSource = Join-Path $Root 'css\styles.css'
if (Test-Path -LiteralPath $SharedCssSource) {
    Copy-Item -LiteralPath $SharedCssSource -Destination (Join-Path $ProjectsTarget 'css\styles.css') -Force
}

foreach ($Image in @(
    'kolory-pion-slaskie-rgb.png',
    'kolory-pion-rzeczpospolita-polska-rgb.png',
    'kolory-pion-unia-europejska-rgb.png',
    'kolory-pion-wojewodztwo-slaskie.png'
)) {
    $ImageSource = Join-Path $Root "media\images\$Image"
    if (Test-Path -LiteralPath $ImageSource) {
        Copy-Item -LiteralPath $ImageSource -Destination (Join-Path $ProjectsTarget "media\images\$Image") -Force
    }
}

$TargetDocs = Join-Path $ProjectsTarget 'docs'
Get-ChildItem -LiteralPath $TargetDocs -File | Remove-Item -Force
$DddDocs = Get-ChildItem -LiteralPath (Join-Path $Root 'docs') -File -Filter 'DDD_KAT*' -ErrorAction SilentlyContinue
foreach ($Doc in $DddDocs) {
    Copy-Item -LiteralPath $Doc.FullName -Destination (Join-Path $TargetDocs $Doc.Name) -Force
}

$ApexStyles = @'
:root {
  --brand: #00594f;
  --text: #1b1f23;
  --surface: #ffffff;
}

* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  color: var(--text);
  background: var(--surface);
  font-family: Arial, Helvetica, sans-serif;
}

main {
  width: min(720px, calc(100% - 2rem));
  text-align: center;
}

img {
  width: min(520px, 86vw);
  height: auto;
}

a {
  color: var(--brand);
  font-weight: 700;
  text-underline-offset: 0.18em;
}

a:focus-visible {
  outline: 4px solid #ffbf47;
  outline-offset: 4px;
}
'@
Set-Content -LiteralPath (Join-Path $ApexTarget 'css\styles.css') -Encoding UTF8 -Value $ApexStyles

$ApexPage = @'
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>epartner24.pl</title>
    <meta name="description" content="Strona epartner24.pl w przygotowaniu.">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <main aria-label="epartner24.pl">
        <img src="media/epartner-logo.png" alt="epartner">
        <p><a href="https://projekty.epartner24.pl/">Projekty epartner</a></p>
    </main>
</body>
</html>
'@
Set-Content -LiteralPath (Join-Path $ApexTarget 'index.html') -Encoding UTF8 -Value $ApexPage

$WidgetMarkup = @'
    <div class="panel-toggles">
        <button id="nav-panel-toggle" class="panel-toggle-btn left" aria-label="Otwórz panel nawigacji" title="Nawigacja"
            aria-controls="nav-panel" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
            </svg>
        </button>
        <button id="a11y-panel-toggle" class="panel-toggle-btn right" aria-label="Otwórz panel dostępności" title="Dostępność"
            aria-controls="a11y-panel" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-accessibility-icon lucide-accessibility" aria-hidden="true">
                <circle cx="16" cy="4" r="1" />
                <path d="m18 19 1-7-6 1" />
                <path d="m5 8 3-3 5.5 3-2.36 3.5" />
                <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
                <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
            </svg>
        </button>
    </div>

    <div id="nav-panel" class="side-panel left" role="dialog" aria-modal="true" aria-labelledby="nav-panel-title"
        hidden>
        <div class="panel-header">
            <h3 id="nav-panel-title" tabindex="-1">Szybka nawigacja</h3>
            <button class="close-panel-btn" aria-label="Zamknij panel nawigacji">&times;</button>
        </div>
        <ul id="nav-panel-list">
        </ul>
    </div>

    <div id="a11y-panel" class="side-panel right" role="dialog" aria-modal="true" aria-labelledby="a11y-panel-title"
        hidden>
        <div class="panel-header">
            <h3 id="a11y-panel-title" tabindex="-1">Panel Dostępności</h3>
            <button class="close-panel-btn" aria-label="Zamknij panel dostępności">&times;</button>
        </div>
        <div class="panel-content">
            <div class="control-group">
                <h4>Rozmiar czcionki</h4>
                <div class="font-controls">
                    <button id="font-decrease">A-</button>
                    <span id="font-size-value">100%</span>
                    <button id="font-increase">A+</button>
                </div>
            </div>
            <div class="control-group">
                <h4>Tryb wyświetlania</h4>
                <div class="theme-controls">
                    <button data-theme="normal" class="active">Normalny</button>
                    <button data-theme="high-contrast">Kontrast</button>
                    <button data-theme="monochrome">Monochromatyczny</button>
                    <button data-theme="dark">Ciemny</button>
                </div>
            </div>
            <div class="control-group">
                <h4>Czytanie tekstu</h4>
                <button id="reading-toggle" aria-pressed="false">Włącz czytanie</button>
            </div>
            <div class="control-group">
                <button id="reset-settings">Resetuj ustawienia</button>
            </div>
        </div>
    </div>

    <div id="keyboard-modal" class="modal-overlay" role="dialog" aria-modal="true"
        aria-labelledby="keyboard-modal-title" hidden>
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="keyboard-modal-title" tabindex="-1">Nawigacja klawiaturą jest aktywna</h2>
                <button class="close-modal-btn" aria-label="Zamknij okno">&times;</button>
            </div>
            <div class="modal-body">
                <p>Użyj klawisza <strong>Tab</strong>, aby przechodzić do kolejnych elementów lub <strong>Shift + Tab</strong>, aby się cofać.</p>
                <p>Aby włączyć tryb czytania na głos, otwórz panel dostępności i aktywuj opcję "Włącz czytanie".</p>
                <p>Wciśnij <strong>Escape</strong>, aby zamknąć to okno.</p>
            </div>
        </div>
    </div>
'@

$EuLogoBar = @'
            <div class="logos" role="img" aria-label="Logotypy: Fundusze Europejskie dla Śląskiego, Rzeczpospolita Polska, Unia Europejska, Województwo Śląskie">
                <img src="media/images/kolory-pion-slaskie-rgb.png" alt="" aria-hidden="true">
                <img src="media/images/kolory-pion-rzeczpospolita-polska-rgb.png" alt="" aria-hidden="true">
                <img src="media/images/kolory-pion-unia-europejska-rgb.png" alt="" aria-hidden="true">
                <img src="media/images/kolory-pion-wojewodztwo-slaskie.png" alt="" aria-hidden="true">
            </div>
'@

$Styles = @'
:root {
  --brand: #00594f;
  --brand-dark: #003d36;
  --accent: #2f7d20;
  --accent-soft: #e8f3e5;
  --text: #1b1f23;
  --muted: #4f5b57;
  --surface: #ffffff;
  --surface-muted: #f4f8f6;
  --border: #c9d8d2;
  --focus: #ffbf47;
}

body[data-theme="normal"] {
  --primary-color: var(--brand);
  --focus-outline: var(--brand-dark);
  --focus-bg: var(--brand-dark);
  --focus-text: #ffffff;
}

body[data-theme="normal"] nav,
body[data-theme="normal"] .panel-toggle-btn {
  background-color: var(--brand);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  color: var(--text);
  background: var(--surface);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  line-height: 1.65;
}

a {
  color: var(--brand);
  text-decoration-thickness: 0.12em;
  text-underline-offset: 0.18em;
}

a:hover {
  color: var(--accent);
}

a:focus-visible,
button:focus-visible {
  outline: 4px solid var(--focus);
  outline-offset: 4px;
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: 1rem;
  z-index: 10;
  transform: translateY(-180%);
  background: var(--focus);
  color: #111;
  padding: 0.75rem 1rem;
  font-weight: 700;
}

.skip-link:focus {
  transform: translateY(0);
}

.site-header {
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.container {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1rem 0;
}

.brand-link {
  display: inline-flex;
  align-items: center;
}

.brand-logo {
  width: min(310px, 58vw);
  height: auto;
  display: block;
}

.top-nav ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.top-nav a {
  font-weight: 700;
}

.hero {
  background: var(--surface-muted);
  border-bottom: 1px solid var(--border);
  padding: clamp(2rem, 6vw, 4.5rem) 0;
}

.hero p {
  max-width: 760px;
  margin: 1rem 0 0;
  color: var(--muted);
  font-size: clamp(1.05rem, 2vw, 1.25rem);
}

h1,
h2,
h3 {
  line-height: 1.2;
  color: var(--brand-dark);
}

h1 {
  max-width: 920px;
  margin: 0;
  font-size: clamp(2rem, 5vw, 4rem);
}

h2 {
  margin-top: 0;
  font-size: clamp(1.7rem, 3vw, 2.5rem);
}

h3 {
  margin-top: 2rem;
  font-size: 1.25rem;
}

main {
  padding: clamp(2rem, 5vw, 4rem) 0;
}

section {
  max-width: 920px;
}

section ul {
  padding-left: 1.35rem;
}

section li + li {
  margin-top: 0.35rem;
}

.documents {
  margin-top: 2.5rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-muted);
}

.documents ul {
  display: grid;
  gap: 0.75rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.documents a {
  display: block;
  min-height: 44px;
  padding: 0.75rem 1rem;
  border-left: 5px solid var(--accent);
  background: var(--surface);
  color: var(--brand-dark);
  font-weight: 700;
}

.site-footer {
  margin-top: 3rem;
  padding: 2rem 0;
  color: #ffffff;
  background: var(--brand-dark);
}

.site-footer h2,
.site-footer h3,
.site-footer p,
.site-footer address,
.site-footer strong {
  color: #ffffff;
}

.site-footer a {
  color: #ffffff;
}

.site-footer h2 {
  border-bottom-color: rgba(255, 255, 255, 0.65);
}

.epartner-header {
  background: var(--surface);
}

.epartner-header .logos {
  margin-bottom: 1rem;
}

.epartner-wordmark {
  width: min(360px, 70vw);
  height: auto;
  display: block;
  margin: 1.5rem auto 1rem;
}

body[data-theme="high-contrast"] .documents a {
  background: #000000;
  color: #ffffff;
  border-color: #ffff00;
}

.panel-toggle-btn {
  width: 68px;
  height: 68px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: var(--brand);
}

body[data-theme="normal"] .panel-toggle-btn,
body[data-theme="dark"] .panel-toggle-btn {
  background-color: var(--brand);
  color: #ffffff;
}

.panel-toggle-btn svg {
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
}

.panel-toggle-btn:hover {
  background: var(--brand-dark);
}

body[data-theme="normal"] .panel-toggle-btn:hover,
body[data-theme="dark"] .panel-toggle-btn:hover {
  background-color: var(--brand-dark);
}

.panel-toggle-btn span {
  display: none;
}

#nav-panel-list .nav-panel-subitem a {
  padding-left: 1.5rem;
  font-size: 0.95em;
}

@media (max-width: 760px) {
  body {
    font-size: 17px;
  }

  .header-inner {
    align-items: flex-start;
    flex-direction: column;
  }

  .top-nav ul {
    flex-direction: column;
  }
}
'@
Set-Content -LiteralPath (Join-Path $ProjectsTarget 'css\epartner.css') -Encoding UTF8 -Value $Styles

$DocumentLinks = ''
if ($DddDocs) {
    $Items = foreach ($Doc in ($DddDocs | Sort-Object Name)) {
        $SafeName = [System.Net.WebUtility]::HtmlEncode($Doc.Name)
        "        <li><a href=""docs/$SafeName"">$SafeName</a></li>"
    }

    $DocumentLinks = @"
        <aside class="documents" aria-labelledby="documents-heading">
            <h2 id="documents-heading">Dokumenty do pobrania</h2>
            <ul>
$($Items -join "`r`n")
            </ul>
        </aside>
"@
}

$Page = @"
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Droga do domu - projekty.epartner24.pl</title>
    <meta name="description" content="Informacje o projekcie Droga do domu realizowanym w partnerstwie z EPARTNER.">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/epartner.css">
</head>
<body data-theme="normal">
$WidgetMarkup
    <a class="skip-link" href="#main-content">Przejdź do głównej treści</a>
    <header class="epartner-header">
        <div class="container">
$EuLogoBar
            <a class="brand-link" href="https://epartner24.pl/" aria-label="epartner24.pl - strona główna">
                <img class="epartner-wordmark" src="media/epartner-logo.png" alt="epartner">
            </a>
            <h1>Droga do domu</h1>
            <h2 class="subtitle">#FunduszeUE</h2>
        </div>
    </header>

    <nav aria-label="Nawigacja strony projektu">
        <div class="container">
            <ul>
                <li><a href="#droga-do-domu">Droga do domu</a></li>
                <li><a href="#documents-heading">Dokumenty</a></li>
                <li><a href="pages/deklaracja-dostepnosci.html">Deklaracja dostępności</a></li>
                <li><a href="#kontakt">Kontakt</a></li>
            </ul>
        </div>
    </nav>

    <main id="main-content" class="container">
$ProjectSection
$DocumentLinks
    </main>

    <footer id="kontakt" class="site-footer">
        <div class="container">
            <h2>Kontakt</h2>
            <address>
                <strong>EPARTNER KURSY JĘZYKOWE SP. Z O.O.</strong><br>
                ul. Kościuszki 12 / 11, 43-100 Tychy, Polska<br>
                KRS 0000615769<br>
                NIP 6462942490<br>
                REGON 364321720
            </address>
            <p><a href="pages/deklaracja-dostepnosci.html">Deklaracja dostępności</a></p>
        </div>
    </footer>
    <script src="js/main.js"></script>
    <script src="js/epartner-nav.js"></script>
</body>
</html>
"@

$DeclarationPage = @"
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deklaracja dostępności - projekty.epartner24.pl</title>
    <meta name="description" content="Deklaracja dostępności strony projekty.epartner24.pl.">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/epartner.css">
</head>
<body data-theme="normal">
$($WidgetMarkup -replace 'href="#main-content"', 'href="#main-content"')
    <a class="skip-link" href="#main-content">Przejdź do głównej treści</a>
    <header class="epartner-header">
        <div class="container">
            <div class="logos" role="img" aria-label="Logotypy: Fundusze Europejskie dla Śląskiego, Rzeczpospolita Polska, Unia Europejska, Województwo Śląskie">
                <img src="../media/images/kolory-pion-slaskie-rgb.png" alt="" aria-hidden="true">
                <img src="../media/images/kolory-pion-rzeczpospolita-polska-rgb.png" alt="" aria-hidden="true">
                <img src="../media/images/kolory-pion-unia-europejska-rgb.png" alt="" aria-hidden="true">
                <img src="../media/images/kolory-pion-wojewodztwo-slaskie.png" alt="" aria-hidden="true">
            </div>
            <a class="brand-link" href="../index.html" aria-label="Strona główna projektów epartner">
                <img class="epartner-wordmark" src="../media/epartner-logo.png" alt="epartner">
            </a>
            <h1>Deklaracja dostępności</h1>
            <h2 class="subtitle">projekty.epartner24.pl</h2>
        </div>
    </header>

    <nav aria-label="Nawigacja powrotu">
        <div class="container">
            <ul>
                <li><a href="../index.html">Powrót do strony projektu</a></li>
            </ul>
        </div>
    </nav>

    <main id="main-content" class="container">
        <section id="a11y-informacje-ogolne" aria-labelledby="a11y-informacje-ogolne-heading">
            <h2 id="a11y-informacje-ogolne-heading">1. Informacje ogólne</h2>
            <p><strong>Podmiot odpowiedzialny:</strong> EPARTNER KURSY JĘZYKOWE SP. Z O.O.</p>
            <p><strong>KRS:</strong> 0000615769</p>
            <p><strong>NIP:</strong> 6462942490</p>
            <p><strong>REGON:</strong> 364321720</p>
            <p><strong>Adres siedziby:</strong> Kościuszki 12 / 11, 43-100 Tychy, Polska</p>
            <p><strong>Adres strony objętej deklaracją:</strong> <a href="https://projekty.epartner24.pl/">https://projekty.epartner24.pl/</a></p>
            <p><strong>Data publikacji strony:</strong> <time datetime="2026-07-08">08.07.2026</time></p>
            <p><strong>Data ostatniej istotnej aktualizacji:</strong> <time datetime="2026-07-08">08.07.2026</time></p>
        </section>

        <section id="a11y-status" aria-labelledby="a11y-status-heading">
            <h2 id="a11y-status-heading">2. Zakres wykonanej samooceny dostępności</h2>
            <p>Deklarację przygotowano na podstawie samooceny technicznej strony, przeglądu elementów istotnych dla dostępności cyfrowej oraz testów w narzędziach walidacyjnych i dostępnościowych. W narzędziach raportujących wynik procentowy uzyskano wyniki pozytywne na poziomie 90% lub wyższym.</p>
            <ul>
                <li>Sprawdzono strukturę nagłówków, język strony, mechanizm pomijania bloków i widoczność nawigacji klawiaturą.</li>
                <li>Sprawdzono obecność alternatyw tekstowych dla elementów graficznych oraz opisowe teksty linków.</li>
                <li>Sprawdzono kontrast podstawowej palety kolorów i tryb wysokiego kontrastu.</li>
                <li>Sprawdzono obecność panelu dostępności i możliwość zmiany rozmiaru tekstu oraz trybu kontrastu.</li>
            </ul>
            <h3>Użyte narzędzia</h3>
            <ul>
                <li><a href="https://wave.webaim.org/report#/https://projekty.epartner24.pl/">WAVE Web Accessibility Evaluation Tool</a></li>
                <li><a href="https://validator.w3.org/nu/?doc=https%3A%2F%2Fprojekty.epartner24.pl%2F">W3C Nu HTML Checker</a></li>
                <li><a href="https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fprojekty.epartner24.pl%2F&amp;profile=css3svg&amp;usermedium=all&amp;warning=1&amp;vextwarning=&amp;lang=pl-PL">W3C CSS Validation Service</a></li>
                <li><a href="https://freeaccessibilitychecker.skynettechnologies.com/?website=https%3A%2F%2Fprojekty.epartner24.pl%2F">Free Accessibility Checker by Skynet Technologies</a></li>
                <li><a href="https://www.accessibilitychecker.org/audit/?website=https%3A%2F%2Fprojekty.epartner24.pl%2F&amp;flag=eu">AccessibilityChecker.org</a></li>
                <li><a href="https://www.tracevalid.com/">TraceValid</a></li>
                <li><a href="https://aeldata.com/accessibility-checker/">AEL Data Accessibility Checker</a></li>
            </ul>
        </section>

        <section id="a11y-metodologia" aria-labelledby="a11y-metodologia-heading">
            <h2 id="a11y-metodologia-heading">3. Metoda oceny dostępności</h2>
            <p>Deklarację sporządzono na podstawie samooceny technicznej strony, testów klawiaturą, kontroli semantyki HTML, kontroli kontrastu podstawowych kolorów oraz przeglądu elementów wymaganych dla zgodności z WCAG 2.2 AA.</p>
        </section>

        <section id="a11y-ulatwienia" aria-labelledby="a11y-ulatwienia-heading">
            <h2 id="a11y-ulatwienia-heading">4. Ułatwienia dostępności</h2>
            <ul>
                <li>Panel dostępności z regulacją rozmiaru tekstu i trybami kontrastu.</li>
                <li>Link "Przejdź do głównej treści".</li>
                <li>Obsługa nawigacji klawiaturą.</li>
                <li>Logiczna struktura nagłówków i sekcji.</li>
            </ul>
        </section>

        <section id="a11y-kontakt" aria-labelledby="a11y-kontakt-heading">
            <h2 id="a11y-kontakt-heading">5. Dane kontaktowe</h2>
            <p>W przypadku problemów z dostępnością strony prosimy o kontakt z administratorem strony epartner24.pl.</p>
            <p><strong>EPARTNER KURSY JĘZYKOWE SP. Z O.O.</strong><br>
            ul. Kościuszki 12 / 11, 43-100 Tychy, Polska</p>
        </section>
    </main>

    <footer id="kontakt" class="site-footer">
        <div class="container">
            <h2>Kontakt</h2>
            <address>
                <strong>EPARTNER KURSY JĘZYKOWE SP. Z O.O.</strong><br>
                ul. Kościuszki 12 / 11, 43-100 Tychy, Polska<br>
                KRS 0000615769<br>
                NIP 6462942490<br>
                REGON 364321720
            </address>
            <p><a href="../index.html">Powrót do strony projektu</a></p>
        </div>
    </footer>
    <script src="../js/main.js"></script>
    <script src="../js/epartner-nav.js"></script>
</body>
</html>
"@

Set-Content -LiteralPath (Join-Path $ProjectsTarget 'index.html') -Encoding UTF8 -Value $Page
Set-Content -LiteralPath (Join-Path $ProjectsTarget 'pages\deklaracja-dostepnosci.html') -Encoding UTF8 -Value $DeclarationPage

Write-Host "Exported apex site to $ApexTarget"
Write-Host "Exported projects site to $ProjectsTarget"
