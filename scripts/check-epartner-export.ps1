$ErrorActionPreference = 'Stop'

$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$Target = Resolve-Path (Join-Path $Root '..\epartner')
$Index = Join-Path $Target 'index.html'

if (-not (Test-Path -LiteralPath $Index)) {
    throw 'Missing epartner index.html'
}

$Html = Get-Content -LiteralPath $Index -Raw -Encoding UTF8
if ($Html -notmatch 'droga-do-domu') {
    throw 'Missing Droga do domu section'
}

if ($Html -match 'strefa-katowice|zwrotnica-katowice|freedom|praktykant') {
    throw 'Found unrelated SCPIP project in epartner export'
}

if ($Html -notmatch 'epartner') {
    throw 'Missing epartner branding'
}

$CnamePath = Join-Path $Target 'CNAME'
if (-not (Test-Path -LiteralPath $CnamePath)) {
    throw 'Missing CNAME'
}

if ((Get-Content -LiteralPath $CnamePath -Raw -Encoding UTF8).Trim() -ne 'epartner24.pl') {
    throw 'Invalid CNAME'
}

$DocsPath = Join-Path $Target 'docs'
if (Test-Path -LiteralPath $DocsPath) {
    $UnexpectedDocs = Get-ChildItem -LiteralPath $DocsPath -File |
        Where-Object { $_.Name -notlike 'DDD_KAT*' }

    if ($UnexpectedDocs) {
        $Names = ($UnexpectedDocs | Select-Object -ExpandProperty Name) -join ', '
        throw "Found non-DDD_KAT documents in epartner export: $Names"
    }
}

Write-Host 'epartner export check passed'
