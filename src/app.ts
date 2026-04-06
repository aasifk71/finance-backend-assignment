import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// --- FIX IS HERE ---
// Corrected Health Check Route (Only req and res)
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Finance API is running' });
});
// -------------------

// API Routes
app.use('/api/v1', routes);

// Global Error Handler
app.use(errorMiddleware);

export default app;