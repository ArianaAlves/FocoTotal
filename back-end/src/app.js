import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import routes from "./routes/index.js";

const app = express();

// CORS configurado para aceitar requisições do frontend
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Vite dev
    'http://localhost:3000',  // React dev alternativo
    'https://foco-total.vercel.app',  // Produção Vercel
    'https://focototal.vercel.app',   // Variação do domínio
    /^https:\/\/.*\.vercel\.app$/     // Qualquer subdomínio do Vercel
  ],
  credentials: false, // Mudando para false para evitar problemas com CORS
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware para parsing JSON com tratamento de erro
app.use(express.json({
  limit: '10mb',
  strict: true
}));

// Middleware para tratar erros de JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Formato JSON inválido',
      error: 'Malformed JSON in request body'
    });
  }
  next(err);
});

app.use(requestLogger);

// Health check endpoint for Render
app.get('/', (req, res) => {
  res.json({
    message: '🚀 FocoTotal API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api', routes);

app.use(errorHandler);

export default app;
