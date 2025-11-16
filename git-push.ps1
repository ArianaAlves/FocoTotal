# Script para fazer push sem derrubar os servidores
param(
    [string]$message = "Update changes"
)

Write-Host "Salvando mudanças..." -ForegroundColor Cyan

# Adicionar arquivos
git add .

# Fazer commit
if ($message) {
    git commit -m $message
} else {
    Write-Host "Informe uma mensagem de commit!" -ForegroundColor Red
    exit 1
}

# Fazer push em segundo plano para não bloquear
Start-Job -ScriptBlock {
    param($repoPath)
    Set-Location $repoPath
    git push origin main
} -ArgumentList (Get-Location).Path | Out-Null

Write-Host "Push iniciado em segundo plano. Os servidores continuarão rodando!" -ForegroundColor Green
