import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes';
import { collegeRoutes } from './routes/college.routes';
import { savedRoutes } from './routes/saved.routes';
import { aiRoutes } from './routes/ai.routes';
import { errorMiddleware } from './middleware/error.middleware';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, error: { message: 'Too many requests from this IP, please try again later.' } }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // tighter limit for auth
  message: { success: false, error: { message: 'Too many auth attempts, please try again later.' } }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(limiter);

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorMiddleware);

export default app;
