@echo off
echo Cleaning node_modules and build artifacts...

:: Clean root node_modules and .turbo
if exist node_modules rmdir /s /q node_modules
if exist .turbo rmdir /s /q .turbo

:: Clean packages
for /d /r packages %%d in (node_modules) do @if exist "%%d" rmdir /s /q "%%d"
for /d /r packages %%d in (dist) do @if exist "%%d" rmdir /s /q "%%d"

:: Clean apps
for /d /r apps %%d in (node_modules) do @if exist "%%d" rmdir /s /q "%%d"
for /d /r apps %%d in (dist) do @if exist "%%d" rmdir /s /q "%%d"

echo Clean complete! 