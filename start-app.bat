@echo off
echo Iniciando o servidor e o cliente...

REM Inicia o servidor em uma nova janela
start cmd /k "cd %~dp0 && node server/index.js"

REM Aguarda 2 segundos para o servidor iniciar
timeout /t 2 /nobreak > nul

REM Inicia o cliente
start cmd /k "cd %~dp0 && npm run dev"

echo Aplicacao iniciada!
