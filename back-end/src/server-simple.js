const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 FocoTotal API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: '✅ API is working!',
    database: process.env.DATABASE_URL ? 'Connected' : 'Not configured'
  });
});

// Auth routes (simulados)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: 'Nome, email e senha são obrigatórios' 
    });
  }
  
  res.json({
    message: 'Usuário registrado com sucesso!',
    user: { id: 1, name, email },
    token: 'fake-jwt-token'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email e senha são obrigatórios' 
    });
  }
  
  res.json({
    message: 'Login realizado com sucesso!',
    user: { id: 1, name: 'Usuário Teste', email },
    token: 'fake-jwt-token'
  });
});

// Users routes
app.get('/api/users', (req, res) => {
  res.json({ 
    message: 'Users endpoint working',
    users: [
      { id: 1, name: 'Usuário 1', email: 'user1@test.com' },
      { id: 2, name: 'Usuário 2', email: 'user2@test.com' }
    ]
  });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: 'User found',
    user: { id: parseInt(id), name: `Usuário ${id}`, email: `user${id}@test.com` }
  });
});

// Tasks routes
app.get('/api/tasks', (req, res) => {
  res.json({ 
    message: 'Tasks endpoint working',
    tasks: [
      { id: 1, title: 'Tarefa 1', description: 'Descrição da tarefa 1', status: 'PENDENTE' },
      { id: 2, title: 'Tarefa 2', description: 'Descrição da tarefa 2', status: 'CONCLUIDA' }
    ]
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ 
      error: 'Título é obrigatório' 
    });
  }
  
  res.status(201).json({
    message: 'Tarefa criada com sucesso!',
    task: { 
      id: Date.now(), 
      title, 
      description: description || '', 
      status: 'PENDENTE',
      createdAt: new Date().toISOString()
    }
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  
  res.json({
    message: 'Tarefa atualizada com sucesso!',
    task: { 
      id: parseInt(id), 
      title, 
      description, 
      status,
      updatedAt: new Date().toISOString()
    }
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: 'Tarefa deletada com sucesso!',
    deletedId: parseInt(id)
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});

module.exports = app;