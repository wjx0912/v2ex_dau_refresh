set http_proxy=http://127.0.0.1:7890
set https_proxy=http://127.0.0.1:7890
set ELECTRON_GET_USE_PROXY=true

call nvm use 22.17.1 64
call npm run build:win
pause