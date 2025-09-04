import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import plateRoutes from './routes/plates';
import recognitionRoutes from './routes/recognition';
import connectDB from './config/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/plates', plateRoutes);
app.use('/api/recognition', recognitionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
  });
});

// Servir archivos subidos estáticamente
app.use('/uploads', express.static('uploads'));

// Middleware de manejo de errores
app.use(
  (error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', error);

    // Manejo de errores de carga de archivos
    if (error.code && error.code.startsWith('LIMIT_')) {
      return res.status(400).json({ error: 'File upload error: ' + error.message });
    }

    if (error.message === 'Not an image! Please upload an image.') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Manejo de excepciones no controladas
process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Manejo de rechazos no controlados
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📊 Health check available at http://localhost:${port}/api/health`);
    });

    // Manejo de cierre de servidor por SIGTERM
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 Process terminated!');
      });
    });
  } catch (err) {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log((err as Error).name, (err as Error).message);
    process.exit(1);
  }
};

startServer();
