import "express-async-errors";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes';
import { errorHandler } from './middleware/errorHandler';
import { requestId } from './middleware/requestId';

dotenv.config();

const app = express();

// Request ID assignment
app.use(requestId);

// Custom Morgan token for tracking request IDs in logs
morgan.token('id', (req: any) => req.requestId || '-');

// Logging (cleaner, skipping backend logging for frontend assets and internal Vite request paths)
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms [ReqID: :id]', {
    skip: (req) => {
      const url = req.url || '';
      return (
        url.startsWith('/src/') ||
        url.startsWith('/@') ||
        url.startsWith('/node_modules/') ||
        url.includes('.tsx') ||
        url.includes('.ts') ||
        url.includes('.css') ||
        url.includes('.js') ||
        url.includes('.svg') ||
        url.includes('.png') ||
        url.includes('.ico') ||
        url === '/favicon.ico'
      );
    },
  })
);

app.set('trust proxy', 1);

app.use(helmet({
  frameguard: false, // Explicitly disable to allow embedding inside Google AI Studio/preview frames
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https:"],
      "connect-src": ["'self'", "https:", "http:", "ws:", "wss:"],
      "frame-ancestors": ["'self'", "https://*.google.com", "https://*.google.sh", "https://*.run.app"],
    },
  } : false,
}));

const allowedOrigins = [
  'https://your-domain.com',
  'https://www.your-domain.com',
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.run.app') ||
        origin.endsWith('.google.sh') ||
        origin.endsWith('.google.com') ||
        origin.includes('google.com');

      if (isAllowed) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);


// Rate limiting (only for API, skipped in development to prevent blocking preview/Vite requests)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV !== 'production',
});
app.use('/api', limiter);

app.use(express.json({ limit: '2mb' }));

// Health check
app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'jobspark-ai',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api/ping', (_, res) => {
  res.json({
    success: true,
    message: 'Backend connected',
    timestamp: Date.now(),
  });
});

// API Routes
app.use('/api', aiRoutes);

// Vite Dev Middleware
export async function configureApp(app: express.Express) {
  if (process.env.NODE_ENV !== "production") {
    console.log("🚀 Starting Vite middleware in development mode...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use(errorHandler);
}

export { app };
