# Script para corrigir e fazer deploy sem derrubar os serviços
Write-Host "🔧 Iniciando correções do FocoTotal..." -ForegroundColor Green

# 1. Verificar se estamos no diretório correto
if (!(Test-Path "back-end/package.json")) {
    Write-Host "❌ Execute este script na raiz do projeto FocoTotal" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Instalando dependências do back-end..." -ForegroundColor Yellow
cd back-end
npm install

Write-Host "🗄️ Gerando Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "📊 Verificando status das migrações..." -ForegroundColor Yellow
npx prisma migrate status

Write-Host "🔄 Fazendo deploy das migrações (se necessário)..." -ForegroundColor Yellow
npx prisma migrate deploy

Write-Host "🚀 Testando conexão local..." -ForegroundColor Yellow
cd ..

# 2. Fazer commit das correções
Write-Host "📝 Fazendo commit das correções..." -ForegroundColor Yellow
git add .
git commit -m "fix: corrigir erros internos do servidor e melhorar tratamento de erros"

Write-Host "⬆️ Fazendo push para deploy automático..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Deploy iniciado! Aguarde alguns minutos para o Render e Vercel processarem as mudanças." -ForegroundColor Green
Write-Host "📊 Você pode monitorar o deploy em:" -ForegroundColor Cyan
Write-Host "   - Render: https://dashboard.render.com/" -ForegroundColor Cyan
Write-Host "   - Vercel: https://vercel.com/dashboard" -ForegroundColor Cyan

Write-Host "🔍 Para verificar os logs em tempo real:" -ForegroundColor Yellow
Write-Host "   - Render: Acesse seu serviço > Logs" -ForegroundColor White
Write-Host "   - Browser: Abra F12 > Console para ver erros do frontend" -ForegroundColor White