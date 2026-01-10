import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase, closeDatabase } from './config/database';
import { configureCloudinary } from './config/cloudinary';
import authRoutes from './routes/auth';
import imageRoutes from './routes/images';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = parseInt(process.env.PORT || '8000', 10);

const isProduction = process.env.NODE_ENV === 'production';
const corsOriginsEnv = process.env.CORS_ORIGINS || '';
const allowedOrigins = corsOriginsEnv
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

const allowAllOrigins = allowedOrigins.includes('*');

console.log('CORS Configuration:', {
  isProduction,
  allowedOrigins,
  allowAllOrigins,
  corsOriginsEnv
});

app.use(cors({
  origin: (origin, callback) => {
    if (allowAllOrigins) {
      return callback(null, true);
    }
    
    if (!origin && !isProduction) {
      return callback(null, true);
    }
    
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log(`CORS blocked origin: ${origin}. Allowed origins:`, allowedOrigins);
    callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configureCloudinary();

app.get('/', (_req: Request, res: Response) => {
  res.json({ 
    message: 'FlipCut API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      api: '/api',
      auth: '/api/auth',
      images: '/api/images'
    }
  });
});

app.get('/api', (_req: Request, res: Response) => {
  res.json({ message: 'FlipCut API', version: '1.0.0' });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    detail: err.message || 'Internal server error',
  });
});

if (require.main === module) {
  async function startServer() {
    try {
      console.log('🚀 Starting FlipCut API server...');
      console.log(`   Port: ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      
      app.listen(PORT, '0.0.0.0', async () => {
        console.log(`✅ FlipCut API server running on port ${PORT}`);
        console.log(`   Health check: http://localhost:${PORT}/api/health`);
        console.log(`   API root: http://localhost:${PORT}/api`);
        
        try {
          await connectDatabase();
        } catch (error: any) {
          console.error('⚠️  MongoDB connection failed:', error.message);
          console.error('   Some features may not work until MongoDB is available');
          console.error('   Health endpoint will still respond');
        }
      });
    } catch (error: any) {
      console.error('❌ Failed to start server:', error.message);
      console.error('');
      console.error('Troubleshooting:');
      console.error('  1. Check if port 8000 is already in use');
      console.error('  2. Verify your environment variables are set');
      process.exit(1);
    }
  }

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await closeDatabase();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await closeDatabase();
    process.exit(0);
  });

  startServer();
}

connectDatabase().catch((error: any) => {
  console.error('⚠️  MongoDB connection failed:', error.message);
});

export default app;
