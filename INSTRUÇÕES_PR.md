## 🚀 Como Criar o Pull Request no GitHub

### Opção 1: Pelo GitHub Web (Recomendado - Mais Fácil)

1. **Acesse o repositório:**
   - Vá para: https://github.com/ArianaAlves/FocoTotal

2. **Clique em "Pull requests"**
   - Tab superior do repositório

3. **Clique em "New pull request"**
   - Botão verde no canto direito

4. **Configure o PR:**
   - **Base:** `main` (branch destino)
   - **Compare:** `feature/bia-exclusao-tarefas` (sua branch)
   - Clique em "Create pull request"

5. **Preencha os detalhes:**
   - **Título:** 
     ```
     feat: Implementar exclusão de tarefas e redesign Matrix
     ```
   
   - **Descrição:** 
     Cole o conteúdo de `PULL_REQUEST.md`

6. **Crie o PR:**
   - Clique em "Create pull request"

---

### Opção 2: Pela Linha de Comando (Alternativa)

```bash
# Já está tudo no GitHub, basta criar o PR via web mesmo
# Mas aqui estão os comandos úteis:

# Ver status
cd /c/Users/Bia/onedrive/desktop/FocoTotal
git status

# Ver diferenças
git diff main..feature/bia-exclusao-tarefas

# Ver commits
git log main..feature/bia-exclusao-tarefas --oneline
```

---

## 📋 Template Sugerido para o PR

```markdown
## 🎯 Descrição
Implementação completa da funcionalidade de exclusão de tarefas com redesign profissional tema Matrix.

## ✨ O que foi feito
- ✅ Exclusão de tarefas com confirmação
- ✅ Validação de segurança (apenas dono)
- ✅ Página de Perfil com edição
- ✅ Dashboard profissional
- ✅ Tema Matrix em toda app
- ✅ Design system completo

## 🎨 Design
- Dark mode corporativo
- Animações suaves
- Totalmente responsivo
- Paleta unificada (#9ab8fa)

## 📊 Commits
7 commits estruturados com funcionalidades

## ✅ Checklist
- [x] Funcionalidade implementada
- [x] Validação de segurança
- [x] Design profissional
- [x] Documentação
- [x] Responsivo
```

---

## 🔍 Após Criar o PR

1. **Aguarde a análise** da equipe
2. **Responda aos comentários** se houver
3. **Faça ajustes** se solicitado
4. **Após aprovação**, clique em "Merge pull request"

---

## 📍 Link Direto para Criar PR

👉 **[Clique aqui para ir direto na comparação de branches](https://github.com/ArianaAlves/FocoTotal/compare/main...feature/bia-exclusao-tarefas)**

---

## ❓ Se Houver Conflitos

Se houver conflitos ao criar o PR:

```bash
# No seu terminal local
cd /c/Users/Bia/onedrive/desktop/FocoTotal

# Atualize main
git fetch origin
git checkout main
git pull origin main

# Volte para sua branch
git checkout feature/bia-exclusao-tarefas

# Merge main em sua branch
git merge main

# Resolva conflitos se houver
# Após resolver, faça commit

git add .
git commit -m "merge: Resolver conflitos com main"
git push origin feature/bia-exclusao-tarefas
```

---

## ✨ Dicas

1. ✅ Título claro e descritivo
2. ✅ Descrição completa com tópicos
3. ✅ Mencione as pessoas para review: `@ArianaAlves`
4. ✅ Adicione labels: `enhancement`, `design`, `frontend`
5. ✅ Associe a um milestone se houver
6. ✅ Referencie issues se houver: `Closes #123`

---

**Status:** Pronto para criar PR ✅
**Data:** 15 de novembro de 2025
**Branch:** `feature/bia-exclusao-tarefas` → `main`