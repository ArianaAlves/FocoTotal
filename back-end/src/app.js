import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

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
