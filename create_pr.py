#!/usr/bin/env python3
"""
Script para criar Pull Request automaticamente no GitHub
Uso: python create_pr.py
"""

import subprocess
import json
import sys

def run_command(cmd):
    """Executar comando shell"""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout.strip(), result.returncode

def create_pr():
    """Criar Pull Request via GitHub CLI"""
    
    print("=" * 60)
    print("🚀 CRIANDO PULL REQUEST AUTOMATICAMENTE")
    print("=" * 60)
    
    # Verificar se GitHub CLI está instalado
    gh_check, code = run_command("gh --version")
    if code != 0:
        print("\n❌ GitHub CLI não está instalado!")
        print("📦 Instale com: winget install GitHub.cli")
        print("\nOu siga as instruções em: https://cli.github.com/")
        return False
    
    print(f"\n✅ GitHub CLI encontrado: {gh_check.split()[2]}")
    
    # Verificar autenticação
    print("\n🔐 Verificando autenticação...")
    auth_check, code = run_command("gh auth status")
    if code != 0:
        print("❌ Não autenticado no GitHub!")
        print("Execute: gh auth login")
        return False
    
    print("✅ Autenticado no GitHub")
    
    # Dados do PR
    title = "feat: Implementar exclusão de tarefas e redesign Matrix"
    
    body = """## 🎯 Descrição

Implementação completa da **funcionalidade de exclusão de tarefas** com design profissional tema Matrix para todo o FocoTotal.

## ✨ Mudanças Principais

### 🔥 Funcionalidades
- ✅ **Exclusão de Tarefas** - Deletar tarefas com confirmação segura
- ✅ **Validação de Segurança** - Apenas o proprietário pode deletar sua tarefa
- ✅ **Página de Perfil** - Edição de dados do usuário com estatísticas
- ✅ **Dashboard Profissional** - Painel com cards informativos

### 🎨 Design & UI/UX
- ✅ **Tema Matrix Profissional** - Dark mode corporativo com gradientes
- ✅ **Design System Completo** - index.css com variáveis globais
- ✅ **Totalmente Responsivo** - Mobile, tablet, desktop

### 📊 Detalhes Técnicos
- Backend: Validação em controller e service
- Frontend: Componentes React com CSS profissional
- Segurança: Verificação de propriedade em ambos os lados

## 📁 Arquivos Principais Modificados

### Novos Arquivos Frontend
- `src/components/TaskCard.jsx` - Card de tarefa com delete
- `src/pages/Tasks.jsx` - Página com lista de tarefas
- `src/pages/Profile.jsx` - Página de perfil do usuário
- `src/pages/Dashboard.jsx` - Painel com cards
- `src/styles/Auth.css` - Estilos para login/register
- `src/styles/Dashboard.css` - Estilos para dashboard

### Modificados
- `src/index.css` - Design system global
- `src/App.css` - Background animado
- `src/pages/Login.jsx` - Design profissional
- `src/pages/Register.jsx` - Design profissional

## ✅ Checklist

- [x] Funcionalidade de exclusão implementada
- [x] Validação de segurança
- [x] Frontend completo
- [x] Tema Matrix aplicado
- [x] Responsivo
- [x] Documentação técnica
- [x] Commits bem estruturados

## 🎬 Como Testar

1. Acesse: http://localhost:5173
2. Login com teste@example.com / senha123
3. Vá para "Minhas Tarefas"
4. Clique no botão delete em uma tarefa
5. Confirme a exclusão

## 📝 Notas

- Todos os commits estão com mensagens descritivas
- Branch atualizada com main
- Código segue padrões MVC do projeto
- Design segue paleta de cores #9ab8fa

---
**Responsável:** Bia | **Data:** 15 de novembro de 2025"""

    print("\n📝 Criando PR com dados:")
    print(f"   Título: {title}")
    print(f"   Branch: feature/bia-exclusao-tarefas → main")
    print(f"   Corpo: {len(body)} caracteres")
    
    # Criar PR
    cmd = f'''gh pr create --title "{title}" --body "{body.replace('"', '\\"')}" --base main --head feature/bia-exclusao-tarefas'''
    
    print("\n🔄 Enviando para GitHub...")
    output, code = run_command(cmd)
    
    if code != 0:
        print(f"❌ Erro ao criar PR: {output}")
        return False
    
    print(f"\n✅ Pull Request criado com sucesso!")
    print(f"🔗 Link: {output}")
    
    return True

if __name__ == "__main__":
    try:
        success = create_pr()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
