
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';

import { testConnection } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SSL_PORT = process.env.SSL_PORT || 5443;
const CLIENT_URL = process.env.CLIENT_URL || 'https://localhost:5173';

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Something went wrong',
  });
});

const start = async () => {
  try {
    await testConnection();
    // HTTP server (optional, for compatibility)
    app.listen(PORT, () => {
      console.log(`🚀 NovaShop API running on HTTP port ${PORT}`);
    });
    // HTTPS server
    const key = fs.readFileSync('../frontend/cert/key.pem');
    const cert = fs.readFileSync('../frontend/cert/cert.pem');
    https.createServer({ key, cert }, app).listen(SSL_PORT, () => {
      console.log(`🔒 NovaShop API running on HTTPS port ${SSL_PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

start();
