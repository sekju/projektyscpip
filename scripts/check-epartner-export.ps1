$ErrorActionPreference = 'Stop'

$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$ApexTarget = Resolve-Path (Join-Path $Root '..\epartner')
$ProjectsTarget = Resolve-Path (Join-Path $Root '..\projekty-epartner')
$ApexIndex = Join-Path $ApexTarget 'index.html'
$ProjectsIndex = Join-Path $ProjectsTarget 'index.html'

if (-not (Test-Path -LiteralPath $ApexIndex)) {
    throw 'Missing apex epartner index.html'
}

$ApexHtml = Get-Content -LiteralPath $ApexIndex -Raw -Encoding UTF8
if ($ApexHtml -notmatch 'epartner-logo.png') {
    throw 'Missing apex logo placeholder'
}

if ((Get-Content -LiteralPath (Join-Path $ApexTarget 'CNAME') -Raw -Encoding UTF8).Trim() -ne 'epartner24.pl') {
    throw 'Invalid apex CNAME'
}

if (-not (Test-Path -LiteralPath $ProjectsIndex)) {
    throw 'Missing projects epartner index.html'
}

$Html = Get-Content -LiteralPath $ProjectsIndex -Raw -Encoding UTF8
if ($Html -notmatch 'droga-do-domu') {
    throw 'Missing Droga do domu section'
}

if ($Html -match 'strefa-katowice|zwrotnica-katowice|freedom|praktykant') {
    throw 'Found unrelated SCPIP project in epartner export'
}

if ($Html -notmatch 'epartner') {
    throw 'Missing epartner branding'
}

$CnamePath = Join-Path $ProjectsTarget 'CNAME'
if (-not (Test-Path -LiteralPath $CnamePath)) {
    throw 'Missing CNAME'
}

if ((Get-Content -LiteralPath $CnamePath -Raw -Encoding UTF8).Trim() -ne 'projekty.epartner24.pl') {
    throw 'Invalid projects CNAME'
}

if ($Html -notmatch 'kolory-pion-unia-europejska-rgb.png') {
    throw 'Missing EU logo bar'
}

if ($Html -notmatch 'a11y-panel-toggle') {
    throw 'Missing accessibility widget'
}

if ($Html -match 'Ä|Ă|Ĺ|Â') {
    throw 'Detected mojibake in projects index.html'
}

if ($Html -notmatch 'KRS 0000615769' -or $Html -notmatch 'NIP 6462942490' -or $Html -notmatch 'REGON 364321720') {
    throw 'Missing epartner registration data'
}

if ($Html -notmatch 'id="cel-projektu"' -or $Html -notmatch 'id="metadane-projektu"') {
    throw 'Missing H3 anchors for side navigation'
}

if ($Html -notmatch 'js/epartner-nav.js') {
    throw 'Missing epartner side navigation script'
}

if ($Html -notmatch 'css/epartner-theme.css') {
    throw 'Missing versioned epartner stylesheet link'
}

$CssPath = Join-Path $ProjectsTarget 'css\epartner-theme.css'
$Css = Get-Content -LiteralPath $CssPath -Raw -Encoding UTF8
if ($Css -notmatch '--brand: #00594f' -or $Css -notmatch 'background-color: var\(--brand\)') {
    throw 'Missing teal branding overrides'
}

foreach ($Theme in @('normal', 'high-contrast', 'monochrome', 'dark')) {
    if ($Css -notmatch "body\[data-theme=`"$Theme`"\] nav a:hover") {
        throw "Missing nav hover style for theme: $Theme"
    }

    if ($Css -notmatch "body\[data-theme=`"$Theme`"\].*\.panel-toggle-btn") {
        throw "Missing panel toggle style for theme: $Theme"
    }
}

if ($Css -notmatch '\.site-footer h2' -or $Css -notmatch '\.site-footer address') {
    throw 'Missing footer contrast overrides'
}

$DeclarationPath = Join-Path $ProjectsTarget 'pages\deklaracja-dostepnosci.html'
if (-not (Test-Path -LiteralPath $DeclarationPath)) {
    throw 'Missing accessibility declaration page'
}

$DeclarationHtml = Get-Content -LiteralPath $DeclarationPath -Raw -Encoding UTF8
if ($DeclarationHtml -notmatch 'Deklaracja dostępności') {
    throw 'Invalid accessibility declaration page'
}

if ($DeclarationHtml -match 'Ä|Ă|Ĺ|Â') {
    throw 'Detected mojibake in accessibility declaration page'
}

if ($DeclarationHtml -match 'w pełni zgodna|częściowo zgodna|Nie stwierdzono krytycznych|należy jeszcze|nie wykonano') {
    throw 'Accessibility declaration contains unverified audit claims'
}

foreach ($ToolName in @('WAVE', 'W3C Nu HTML Checker', 'W3C CSS Validation Service', 'AccessibilityChecker.org', 'TraceValid', 'AEL Data Accessibility Checker')) {
    if ($DeclarationHtml -notmatch [regex]::Escape($ToolName)) {
        throw "Missing accessibility tool in declaration: $ToolName"
    }
}

$DocsPath = Join-Path $ProjectsTarget 'docs'
if (Test-Path -LiteralPath $DocsPath) {
    $UnexpectedDocs = Get-ChildItem -LiteralPath $DocsPath -File |
        Where-Object { $_.Name -notlike 'DDD_KAT*' }

    if ($UnexpectedDocs) {
        $Names = ($UnexpectedDocs | Select-Object -ExpandProperty Name) -join ', '
        throw "Found non-DDD_KAT documents in epartner export: $Names"
    }
}

Write-Host 'epartner export check passed'
