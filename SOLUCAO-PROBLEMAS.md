# 🔧 Guia de Solução de Problemas - FocoTotal

## ❌ "Erro interno do servidor" no Login

### 🔍 **Principais Causas Identificadas:**

1. **❌ Banco de dados SQLite vs PostgreSQL**

   - **Problema:** O schema estava configurado para SQLite mas o Render usa PostgreSQL
   - **✅ Correção:** Alterado provider para `postgresql` no schema.prisma

2. **❌ Variáveis de ambiente não configuradas**

   - **Problema:** JWT_SECRET ou DATABASE_URL não definidas no Render
   - **✅ Verificar:** Render Dashboard > Seu Serviço > Environment

3. **❌ CORS bloqueando requisições**

   - **Problema:** Frontend não conseguia se comunicar com backend
   - **✅ Correção:** CORS configurado para aceitar domínios Vercel

4. **❌ Conexão instável com banco**
   - **Problema:** Render free tier pode ter limitações de conexão
   - **✅ Correção:** Implementado retry de conexão e melhor logging

---

## 🚀 **Como Aplicar as Correções SEM Derrubar os Serviços:**

### 1. **Execute o Script de Correção:**

```powershell
.\fix-deploy.ps1
```

### 2. **Verificar Variáveis no Render:**

1. Acesse [Render Dashboard](https://dashboard.render.com/)
2. Clique no seu serviço `focototal-backend`
3. Vá em **Environment**
4. Verifique se existem:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `JWT_SECRET` (deve ser gerado automaticamente)
   - `DATABASE_URL` (deve vir do banco conectado)

### 3. **Verificar Logs em Tempo Real:**

1. **Render:** Dashboard > Seu Serviço > Logs
2. **Vercel:** Dashboard > Seu Projeto > Functions
3. **Browser:** F12 > Console (para erros frontend)

---

## 🔄 **Deploy Automático (Zero Downtime):**

As correções foram feitas de forma que:

- ✅ **Render:** Faz deploy automático no próximo push
- ✅ **Vercel:** Deploy automático do frontend
- ✅ **Banco:** Migrações aplicadas automaticamente
- ✅ **Zero Downtime:** Serviços continuam rodando

---

## 🆘 **Se o Erro Persistir:**

### 1. **Verificar Logs do Render:**

```
> Render Dashboard > focototal-backend > Logs
```

Procure por:

- ❌ Database connection failed
- ❌ JWT_SECRET is required
- ❌ Port already in use

### 2. **Testar API Diretamente:**

```
GET https://focototal.onrender.com/api
```

Deve retornar: `{"message": "🚀 FocoTotal API is running!"}`

### 3. **Verificar Frontend:**

1. Abra F12 > Network
2. Tente fazer login
3. Veja se a requisição chega ao backend

### 4. **Última Opção (SEM derrubar):**

1. No Render: **Manual Deploy** (não "Restart")
2. No Vercel: **Redeploy** (não "Delete")

---

## 📊 **Monitoramento:**

- **Status Backend:** https://focototal.onrender.com/
- **Status Frontend:** https://foco-total.vercel.app/
- **Banco de Dados:** Render Dashboard > Database > Metrics

---

## 🐛 **Debug Mode (se necessário):**

Se precisar ativar logs detalhados:

1. Render > Environment > Add: `DEBUG=*`
2. Fazer novo deploy
3. **LEMBRAR:** Remover depois para não sobrecarregar

---

_✅ Todas as correções foram aplicadas automaticamente!_
_🚀 Aguarde 2-3 minutos para o deploy completar._
