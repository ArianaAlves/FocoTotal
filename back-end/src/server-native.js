const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3000;

// Helper function to handle CORS
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  // Routes
  if (path === '/' && method === 'GET') {
    sendJSON(res, 200, {
      message: '🚀 FocoTotal API is running!',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    });
  }
  else if (path === '/api/test' && method === 'GET') {
    sendJSON(res, 200, {
      message: '✅ API Test successful!',
      status: 'working',
      database: process.env.DATABASE_URL ? 'configured' : 'not configured',
      timestamp: new Date().toISOString()
    });
  }
  else if (path === '/api/users' && method === 'GET') {
    sendJSON(res, 200, {
      message: 'Users endpoint working',
      users: [],
      count: 0
    });
  }
  else if (path === '/api/tasks' && method === 'GET') {
    sendJSON(res, 200, {
      message: 'Tasks endpoint working',
      tasks: [],
      count: 0
    });
  }
  else if (path === '/health' && method === 'GET') {
    sendJSON(res, 200, {
      status: 'UP',
      service: 'FocoTotal API',
      timestamp: new Date().toISOString()
    });
  }
  else {
    // 404 Not Found
    sendJSON(res, 404, {
      error: 'Endpoint not found',
      path: path,
      method: method,
      available_endpoints: [
        'GET /',
        'GET /api/test',
        'GET /api/users',
        'GET /api/tasks',
        'GET /health'
      ]
    });
  }
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FocoTotal API Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ Database configured: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
  console.log(`📡 Server URL: http://0.0.0.0:${PORT}`);
});

// Error handling
server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
});

process.on('SIGTERM', () => {
  console.log('👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

module.exports = server;