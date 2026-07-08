$ErrorActionPreference = 'Stop'

$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$Target = Join-Path $Root '..\epartner'
$Target = [System.IO.Path]::GetFullPath($Target)

if (-not (Test-Path -LiteralPath $Target)) {
    New-Item -ItemType Directory -Force -Path $Target | Out-Null
}

foreach ($Folder in @('css', 'js', 'media', 'docs')) {
    New-Item -ItemType Directory -Force -Path (Join-Path $Target $Folder) | Out-Null
}

Set-Content -LiteralPath (Join-Path $Target 'CNAME') -Encoding UTF8 -Value 'epartner24.pl'

$Readme = @'
# epartner24.pl

Statyczna strona projektu "Droga do domu" dla domeny epartner24.pl.

Zawartosc jest generowana z repo projektyscpip przez `scripts/export-epartner.ps1`.
'@
Set-Content -LiteralPath (Join-Path $Target 'README.md') -Encoding UTF8 -Value $Readme

$SourceHtmlPath = Join-Path $Root 'index.html'
$SourceHtml = Get-Content -LiteralPath $SourceHtmlPath -Raw -Encoding UTF8
$SectionMatch = [regex]::Match($SourceHtml, '(?s)<section id="droga-do-domu"[^>]*>.*?</section>')
if (-not $SectionMatch.Success) {
    throw 'Could not find #droga-do-domu section'
}

$ProjectSection = $SectionMatch.Value

$ProjectSection = $ProjectSection -replace '<h3>Metadane Projektu</h3>', '<h3>Metadane projektu</h3>'

$LogoSource = Join-Path $Root 'media\epartner-logo-concept.png'
if (-not (Test-Path -LiteralPath $LogoSource)) {
    throw 'Missing media/epartner-logo-concept.png'
}
Copy-Item -LiteralPath $LogoSource -Destination (Join-Path $Target 'media\epartner-logo.png') -Force

$JsSource = Join-Path $Root 'js\main.js'
if (Test-Path -LiteralPath $JsSource) {
    Copy-Item -LiteralPath $JsSource -Destination (Join-Path $Target 'js\main.js') -Force
}

$TargetDocs = Join-Path $Target 'docs'
Get-ChildItem -LiteralPath $TargetDocs -File | Remove-Item -Force
$DddDocs = Get-ChildItem -LiteralPath (Join-Path $Root 'docs') -File -Filter 'DDD_KAT*' -ErrorAction SilentlyContinue
foreach ($Doc in $DddDocs) {
    Copy-Item -LiteralPath $Doc.FullName -Destination (Join-Path $TargetDocs $Doc.Name) -Force
}

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

.site-footer a {
  color: #ffffff;
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
Set-Content -LiteralPath (Join-Path $Target 'css\epartner.css') -Encoding UTF8 -Value $Styles

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

$GeneratedAt = Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'
$Page = @"
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Droga do domu - epartner24.pl</title>
    <meta name="description" content="Informacje o projekcie Droga do domu realizowanym w partnerstwie z EPARTNER.">
    <link rel="stylesheet" href="css/epartner.css">
</head>
<body>
    <a class="skip-link" href="#main">Przejdz do tresci</a>
    <header class="site-header">
        <div class="container header-inner">
            <a class="brand-link" href="/" aria-label="epartner24.pl - strona glowna">
                <img class="brand-logo" src="media/epartner-logo.png" alt="epartner">
            </a>
            <nav class="top-nav" aria-label="Nawigacja glowna">
                <ul>
                    <li><a href="#droga-do-domu">Droga do domu</a></li>
                    <li><a href="#kontakt">Kontakt</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <div class="hero">
        <div class="container">
            <h1>Droga do domu</h1>
            <p>Kompleksowe wsparcie osob w kryzysie bezdomnosci, realizowane w partnerstwie z EPARTNER.</p>
        </div>
    </div>

    <main id="main" class="container">
$ProjectSection
$DocumentLinks
    </main>

    <footer id="kontakt" class="site-footer">
        <div class="container">
            <h2>Kontakt</h2>
            <address>
                <strong>EPARTNER Kursy Jezykowe spolka z ograniczona odpowiedzialnoscia</strong><br>
                epartner24.pl
            </address>
            <p>Ostatnia aktualizacja eksportu: $GeneratedAt</p>
        </div>
    </footer>
    <script src="js/main.js"></script>
</body>
</html>
"@

Set-Content -LiteralPath (Join-Path $Target 'index.html') -Encoding UTF8 -Value $Page

Write-Host "Exported epartner site to $Target"
