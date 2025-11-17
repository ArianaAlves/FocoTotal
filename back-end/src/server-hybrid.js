const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Tentativa de importar Prisma (pode falhar se não estiver instalado)
let prisma = null;
let isDatabaseConnected = false;

async function initializePrisma() {
  try {
    if (process.env.DATABASE_URL) {
      console.log('🔄 Attempting to connect to database...');
      const { PrismaClient } = require('@prisma/client');

      prisma = new PrismaClient({
        log: ['error'],
      });

      // Testar conexão
      await prisma.$connect();
      console.log('✅ Database connected successfully with Prisma!');
      isDatabaseConnected = true;
    } else {
      console.log('⚠️ DATABASE_URL not found, using mock data');
    }
  } catch (error) {
    console.log('❌ Database connection failed, using mock data:', error.message);
    prisma = null;
    isDatabaseConnected = false;
  }
}

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 FocoTotal API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.1.0',
    database: isDatabaseConnected ? '✅ Prisma + PostgreSQL' : '📦 Mock Data',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: '✅ API is working!',
    database: isDatabaseConnected ? '✅ Prisma + PostgreSQL' : '📦 Mock Data',
    prisma: isDatabaseConnected ? 'Active' : 'Not connected',
    timestamp: new Date().toISOString()
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

    if (isDatabaseConnected && prisma) {
      // Usar Prisma
      const bcrypt = require('bcryptjs');

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
        message: '✅ Usuário registrado com sucesso! (Database)',
        user: { id: user.id, name: user.name, email: user.email },
        source: 'database'
      });
    } else {
      // Fallback - dados simulados
      res.status(201).json({
        message: '✅ Usuário registrado com sucesso! (Mock)',
        user: { id: Date.now(), name, email },
        source: 'mock'
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

    if (isDatabaseConnected && prisma) {
      // Usar Prisma
      const bcrypt = require('bcryptjs');

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
        message: '✅ Login realizado com sucesso! (Database)',
        user: { id: user.id, name: user.name, email: user.email },
        source: 'database'
      });
    } else {
      // Fallback - dados simulados
      res.json({
        message: '✅ Login realizado com sucesso! (Mock)',
        user: { id: 1, name: 'Usuário Teste', email },
        source: 'mock'
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
    if (isDatabaseConnected && prisma) {
      // Usar Prisma
      const tasks = await prisma.task.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        message: '📋 Tasks from database',
        tasks: tasks,
        count: tasks.length,
        source: 'database'
      });
    } else {
      // Fallback - dados simulados
      res.json({
        message: '📋 Tasks from mock data',
        tasks: [
          {
            id: 1,
            title: 'Tarefa 1',
            description: 'Descrição da tarefa 1',
            status: 'PENDENTE',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Tarefa 2',
            description: 'Descrição da tarefa 2',
            status: 'CONCLUIDA',
            createdAt: new Date().toISOString()
          }
        ],
        count: 2,
        source: 'mock'
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

    if (isDatabaseConnected && prisma) {
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
        message: '✅ Tarefa criada com sucesso! (Database)',
        task: task,
        source: 'database'
      });
    } else {
      // Fallback - dados simulados
      res.status(201).json({
        message: '✅ Tarefa criada com sucesso! (Mock)',
        task: {
          id: Date.now(),
          title,
          description: description || '',
          status: 'PENDENTE',
          createdAt: new Date().toISOString()
        },
        source: 'mock'
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
    if (isDatabaseConnected && prisma) {
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
        message: '👥 Users from database',
        users: users,
        count: users.length,
        source: 'database'
      });
    } else {
      // Fallback - dados simulados
      res.json({
        message: '👥 Users from mock data',
        users: [
          { id: 1, name: 'Usuário 1', email: 'user1@test.com', createdAt: new Date().toISOString() },
          { id: 2, name: 'Usuário 2', email: 'user2@test.com', createdAt: new Date().toISOString() }
        ],
        count: 2,
        source: 'mock'
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
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
async function startServer() {
  await initializePrisma();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Database: ${isDatabaseConnected ? '✅ PostgreSQL + Prisma' : '📦 Mock Data'}`);
    console.log(`📡 Server URL: http://0.0.0.0:${PORT}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 Shutting down server...');
  if (prisma) {
    await prisma.$disconnect();
  }
  process.exit(0);
});

startServer();

module.exports = app;