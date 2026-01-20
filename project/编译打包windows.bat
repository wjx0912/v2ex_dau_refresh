@echo off
set http_proxy=http://127.0.0.1:7890
set https_proxy=http://127.0.0.1:7890
set ELECTRON_GET_USE_PROXY=true


::ref https://github.com/alex8088/electron-vite/issues/749
rm -fr %LOCALAPPDATA%\electron-builder
rm -fr %LOCALAPPDATA%\electron
rm -fr dist
rm -fr package-lock.json

call nvm use 22.17.1 64
call npm  i
call npm run build
call npm run build:win


pause
