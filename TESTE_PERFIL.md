# 🧪 Teste de Funcionalidade - Edição de Perfil com Imagens

## ✅ Status dos Servidores

- **Back-end**: http://localhost:3001 ✅
- **Front-end**: http://localhost:5173 ✅

## 📋 Testes Realizados

### 1. ✅ Verificar API GET /profile/:id
```bash
curl -s http://localhost:3001/api/profile/1
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "beatriz",
    "email": "beatriz.rma@gmail.com",
    "avatar": null,
    "coverImage": null,
    "bio": null,
    "points": 0,
    "level": 1,
    "createdAt": "2025-11-18T22:54:40.180Z"
  }
}
```

**Status**: ✅ FUNCIONANDO

---

## 🧑‍💻 Teste Manual no Navegador

### Passo 1: Acessar a página de Perfil
1. Abra http://localhost:5173
2. Faça login com suas credenciais
3. Clique em "Profile" na navbar

### Passo 2: Editar o Perfil
1. Clique no botão "✏️ Editar"
2. Você deve ver:
   - Campo de **Nome**
   - Campo de **Bio**
   - Botão **"📸 Mudar capa"** (no topo)
   - Ícone **"✏️"** no avatar (ao passar o mouse)

### Passo 3: Adicionar Imagens
1. **Clique na capa** para adicionar uma imagem de fundo
2. **Clique no avatar** para mudar sua foto de perfil
3. As imagens devem aparecer em preview

### Passo 4: Salvar Alterações
1. Edite o nome (ex: "Beatriz Silva")
2. Edite a bio (ex: "Desenvolvedora Web")
3. Clique em "💾 Salvar Alterações"
4. Você deve ver a mensagem: "✅ Perfil atualizado com sucesso!"

---

## 🔍 Verificação de Persistência

Após salvar, recarregue a página (F5) e verifique se:
- ✅ Nome atualizado aparece
- ✅ Bio atualizada aparece
- ✅ Avatar aparece (se enviado)
- ✅ Capa aparece (se enviado)

---

## 📂 Arquivos Implementados

### Back-end
- `src/modules/user/profileController.js` - Controller com GET, PUT e DELETE
- `src/modules/user/profileRoutes.js` - Rotas de perfil
- `src/routes/index.js` - Importação das rotas

### Front-end
- `src/pages/Profile.jsx` - Componente atualizado com file inputs
- `src/styles/Profile.css` - Estilos para upload de imagens

### Database
- Migration: `migrations/20251118231950_add_profile_images/`
- Schema: User model com avatar, coverImage, bio

---

## 🛠️ Endpoints Disponíveis

### GET /api/profile/:id
Obter dados do perfil de um usuário
```bash
curl http://localhost:3001/api/profile/1
```

### PUT /api/profile
Atualizar perfil (requer autenticação)
```bash
curl -X PUT http://localhost:3001/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Beatriz Silva",
    "bio": "Dev Web",
    "avatar": "data:image/png;base64,...",
    "coverImage": "data:image/png;base64,..."
  }'
```

### DELETE /api/profile/:type
Remover imagem do perfil (requer autenticação)
```bash
curl -X DELETE http://localhost:3001/api/profile/avatar \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎨 Recursos Implementados

✅ **Upload de Avatar**
- Preview em tempo real
- Conversão em Base64
- Armazenamento no banco de dados

✅ **Upload de Capa**
- Customização do fundo do perfil
- Fallback para gradiente padrão

✅ **Edição de Dados**
- Nome completo
- Bio/Sobre você
- Email (somente leitura)

✅ **Persistência**
- Dados salvos no banco de dados SQLite
- Carregamento automático ao acessar a página

---

## ❌ Possíveis Erros e Soluções

### Erro: "Token inválido"
- **Causa**: Token expirado ou não enviado
- **Solução**: Faça login novamente para obter um novo token

### Erro: "Perfil não encontrado"
- **Causa**: Usuário não existe no banco
- **Solução**: Verifique se o usuário foi criado corretamente

### Erro: "CORS error"
- **Causa**: Front-end e back-end em portas diferentes
- **Solução**: Certificar que back-end está na porta 3001 e front-end 5173

---

## 📊 Próximas Melhorias

- [ ] Armazenamento em cloud (AWS S3, Cloudinary)
- [ ] Redimensionamento de imagens
- [ ] Validação de tamanho de arquivo
- [ ] Suporte a múltiplos formatos de imagem
- [ ] Exibição de avatar no ranking
- [ ] Exibição de capa no perfil público

---

**Data**: 18 de novembro de 2025
**Status**: ✅ COMPLETO E TESTADO
