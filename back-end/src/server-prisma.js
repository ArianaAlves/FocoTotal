const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { prisma, connectDatabase } = require('./database/prisma');

const app = express();
const PORT = process.env.PORT || 3000;

// Variável para controlar se o banco está conectado
let isDatabaseConnected = false;

app.use(cors());
app.use(express.json());

// Inicializar conexão com o banco
async function initializeDatabase() {
  if (process.env.DATABASE_URL) {
    isDatabaseConnected = await connectDatabase();
  } else {
    console.log('⚠️ DATABASE_URL not configured, using mock data');
  }
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 FocoTotal API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: isDatabaseConnected ? 'Connected (Prisma + PostgreSQL)' : 'Mock Data',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: '✅ API is working!',
    database: isDatabaseConnected ? 'Connected (Prisma + PostgreSQL)' : 'Mock Data',
    prisma: isDatabaseConnected ? 'Active' : 'Not connected'
  });
});

// Auth routes com Prisma + Fallback
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Nome, email e senha são obrigatórios'
      });
    }

    if (isDatabaseConnected) {
      // Usar Prisma
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          error: 'Email já está em uso'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      });

      res.status(201).json({
        message: 'Usuário registrado com sucesso!',
        user: { id: user.id, name: user.name, email: user.email },
        token: 'jwt-token-here'
      });
    } else {
      // Fallback - dados simulados
      res.status(201).json({
        message: 'Usuário registrado com sucesso! (Mock)',
        user: { id: Date.now(), name, email },
        token: 'fake-jwt-token'
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios'
      });
    }

    if (isDatabaseConnected) {
      // Usar Prisma
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }

      res.json({
        message: 'Login realizado com sucesso!',
        user: { id: user.id, name: user.name, email: user.email },
        token: 'jwt-token-here'
      });
    } else {
      // Fallback - dados simulados
      res.json({
        message: 'Login realizado com sucesso! (Mock)',
        user: { id: 1, name: 'Usuário Teste', email },
        token: 'fake-jwt-token'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Tasks routes com Prisma + Fallback
app.get('/api/tasks', async (req, res) => {
  try {
    if (isDatabaseConnected) {
      // Usar Prisma - buscar todas as tarefas com usuários
      const tasks = await prisma.task.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        message: 'Tasks from database',
        tasks: tasks,
        count: tasks.length
      });
    } else {
      // Fallback - dados simulados
      res.json({
        message: 'Tasks endpoint working (Mock)',
        tasks: [
          { id: 1, title: 'Tarefa 1', description: 'Descrição da tarefa 1', status: 'PENDENTE' },
          { id: 2, title: 'Tarefa 2', description: 'Descrição da tarefa 2', status: 'CONCLUIDA' }
        ],
        count: 2
      });
    }
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, userId = 1 } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'Título é obrigatório'
      });
    }

    if (isDatabaseConnected) {
      // Usar Prisma
      const task = await prisma.task.create({
        data: {
          title,
          description: description || '',
          userId: parseInt(userId)
        },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      res.status(201).json({
        message: 'Tarefa criada com sucesso!',
        task: task
      });
    } else {
      // Fallback - dados simulados
      res.status(201).json({
        message: 'Tarefa criada com sucesso! (Mock)',
        task: {
          id: Date.now(),
          title,
          description: description || '',
          status: 'PENDENTE',
          createdAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Users routes com Prisma + Fallback
app.get('/api/users', async (req, res) => {
  try {
    if (isDatabaseConnected) {
      // Usar Prisma
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: {
            select: { tasks: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        message: 'Users from database',
        users: users,
        count: users.length
      });
    } else {
      // Fallback - dados simulados
      res.json({
        message: 'Users endpoint working (Mock)',
        users: [
          { id: 1, name: 'Usuário 1', email: 'user1@test.com' },
          { id: 2, name: 'Usuário 2', email: 'user2@test.com' }
        ],
        count: 2
      });
    }
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  await initializeDatabase();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Database: ${isDatabaseConnected ? 'Connected (PostgreSQL)' : 'Mock Data'}`);
    console.log(`📡 Server URL: http://0.0.0.0:${PORT}`);
  });
}

startServer();

module.exports = app;