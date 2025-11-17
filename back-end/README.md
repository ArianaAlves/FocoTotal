# FocoTotal Backend

Backend da aplicação FocoTotal - Sistema de gerenciamento de tarefas e produtividade.

## Deploy no Render

Este projeto está configurado para deploy automático no Render.

### Variáveis de Ambiente Necessárias:

```
PORT=3000
JWT_SECRET=sua_chave_secreta_jwt_muito_segura_aqui
DATABASE_URL=sua_url_do_banco_de_dados_postgresql
```

### Comandos de Deploy:

- **Build Command:** `npm run build`
- **Start Command:** `npm start`

### Configuração do Banco de Dados:

O projeto usa Prisma ORM. No deploy, certifique-se de:

1. Usar PostgreSQL como banco de dados
2. Configurar a DATABASE_URL corretamente
3. As migrações serão executadas automaticamente no build
