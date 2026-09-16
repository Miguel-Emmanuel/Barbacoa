# Copiar imágenes de Barbacoa La Virgencita al proyecto
# Ejecutar en PowerShell desde la carpeta del proyecto:
#   .\copiar-imagenes.ps1

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$dest = Join-Path $projectRoot "assets\images"
$sourceCandidates = @(
  Join-Path $env:USERPROFILE ".cursor\projects\c-Users-gemelo-Documents-MIKE-TwisoTech-BARBACOA\site\assets\images"
  Join-Path $env:USERPROFILE ".cursor\projects\c-Users-gemelo-Documents-MIKE-TwisoTech-BARBACOA\assets"
)

New-Item -ItemType Directory -Force -Path $dest | Out-Null

$named = Join-Path $sourceCandidates[0] "*.png"
if (Test-Path (Split-Path $named)) {
  Copy-Item (Join-Path $sourceCandidates[0] "*.png") $dest -Force
  Write-Host "Imágenes copiadas desde site/assets/images"
  Get-ChildItem $dest -Filter *.png | Format-Table Name, Length
  exit 0
}

# Fallback: nombres largos del storage de Cursor
$src = $sourceCandidates[1]
if (-not (Test-Path $src)) {
  throw "No se encontró la carpeta de imágenes fuente."
}

$map = @{
  "1e289eda" = "logo-gemelos-ortega.png"
  "e87a1345" = "terraza-hero.png"
  "a460addf" = "terraza-bosque.png"
  "ea6ba579" = "terraza-montana.png"
  "b83d4cf8" = "cartel-inauguracion.png"
}

foreach ($key in $map.Keys) {
  $file = Get-ChildItem -Path $src -Filter "*$key*.png" | Select-Object -First 1
  if (-not $file) { Write-Warning "No se encontró imagen para $key"; continue }
  Copy-Item $file.FullName (Join-Path $dest $map[$key]) -Force
  Write-Host "OK $($map[$key])"
}

Get-ChildItem $dest -Filter *.png | Format-Table Name, Length
Write-Host "`nListo. Abre index.html en el navegador."
