// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { collegeRoutes } from './routes/colleges';
import { authRoutes } from './routes/auth';
import { savedRoutes } from './routes/saved';
import { compareRoutes } from './routes/compare';
import { aiRoutes } from './routes/ai';
import { ZodError } from 'zod';

const app = express();

// Security headers — one line, big impact
app.use(helmet());

// CORS — only allow your Vercel domain in production
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL  // e.g. https://campiq.vercel.app
    : 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Health check — Render uses this to verify the service is up
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() })); // keep old one for compat

// Routes
app.use('/api/colleges', collegeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/ai', aiRoutes);

// Global error handler — MUST be the last middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ERROR]', err);
  
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.errors
      }
    });
  }

  // Don't leak internal error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : err.message;

  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
    }
  });
});

export default app;
