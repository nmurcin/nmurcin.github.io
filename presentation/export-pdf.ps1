param([string]$RenderDirectory)
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
$pptxPath = Join-Path $repo 'downloads/Nathaniel_Murcin_Engineering_Portfolio_V2.pptx'
$pdfPath = Join-Path $repo 'downloads/Nathaniel_Murcin_Engineering_Portfolio_V2.pdf'
if ($RenderDirectory) { $RenderDirectory = [IO.Path]::GetFullPath($RenderDirectory); New-Item -ItemType Directory -Force -Path $RenderDirectory | Out-Null }
$app = New-Object -ComObject PowerPoint.Application
$deck = $null
try {
    $deck = $app.Presentations.Open($pptxPath, $true, $false, $false)
    $deck.SaveAs($pdfPath, 32)
    if ($RenderDirectory) {
        for ($i = 1; $i -le $deck.Slides.Count; $i++) {
            $deck.Slides.Item($i).Export((Join-Path $RenderDirectory ('slide-{0:D2}.jpg' -f $i)), 'JPG', 1600, 900)
        }
    }
    Write-Output ('Exported PDF: ' + $pdfPath)
} finally {
    if ($deck) { $deck.Close() }
    $app.Quit()
}
