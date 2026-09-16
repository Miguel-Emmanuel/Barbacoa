@echo off
chcp 65001 >nul
title Instalar / reparar imagenes - Barbacoa La Virgencita
echo.
echo Reparando fotos en assets\images ...
echo.

set "ROOT=%~dp0"
set "DST=%ROOT%assets\images"
set "SITE=%USERPROFILE%\.cursor\projects\c-Users-gemelo-Documents-MIKE-TwisoTech-BARBACOA\site\assets\images"

mkdir "%DST%" 2>nul

if exist "%DST%\IMG3.png" (
  copy /Y "%DST%\IMG3.png" "%DST%\terraza-hero.png" >nul
  copy /Y "%DST%\IMG3.png" "%DST%\terraza-bosque.png" >nul
  copy /Y "%DST%\IMG3.png" "%DST%\terraza-montana.png" >nul
  echo OK: IMG3 -^> terraza-hero / bosque / montana
)

if exist "%DST%\LOGO.png" (
  copy /Y "%DST%\LOGO.png" "%DST%\logo-gemelos-ortega.png" >nul
  echo OK: LOGO.png
)

REM Copiar cartel de sabados si existe con nombre largo
for %%F in ("%DST%\*S*BADOS*.png") do (
  copy /Y "%%~F" "%DST%\cartel-sabados.png" >nul
  copy /Y "%%~F" "%DST%\cartel-inauguracion.png" >nul
  echo OK: cartel sabados
)

REM Si hay copia en site, traer faltantes
if exist "%SITE%\terraza-hero.png" if not exist "%DST%\terraza-hero.png" copy /Y "%SITE%\terraza-hero.png" "%DST%\" >nul
if exist "%SITE%\terraza-bosque.png" if not exist "%DST%\terraza-bosque.png" copy /Y "%SITE%\terraza-bosque.png" "%DST%\" >nul
if exist "%SITE%\terraza-montana.png" if not exist "%DST%\terraza-montana.png" copy /Y "%SITE%\terraza-montana.png" "%DST%\" >nul
if exist "%SITE%\cartel-inauguracion.png" if not exist "%DST%\cartel-inauguracion.png" copy /Y "%SITE%\cartel-inauguracion.png" "%DST%\" >nul
if exist "%SITE%\cartel-sabados.png" if not exist "%DST%\cartel-sabados.png" copy /Y "%SITE%\cartel-sabados.png" "%DST%\" >nul

echo.
echo Archivos actuales:
dir /b "%DST%\*.png"
echo.
echo Listo. Recarga la pagina con Ctrl+F5.
pause
