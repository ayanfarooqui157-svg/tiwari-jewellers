import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const serverDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: resolve(serverDirectory, '..', '.env') });
dotenv.config({ path: resolve(serverDirectory, '.env') });

const rawEnv = (process.env.NODE_ENV || '').toLowerCase();
const isProd = rawEnv === 'production';
const nodeEnv = isProd ? 'production' : 'development';
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is required. Set it in the server environment.');
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv,
  isDev: !isProd,
  jwtSecret,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@tiwarijewellers.com',
    password: process.env.ADMIN_PASSWORD || 'RoyalTiwari@Admin2026',
    name: process.env.ADMIN_NAME || 'Vikram Tiwari (Director)'
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_tiwarijewellers_demo',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_demo'
  },
  mongodb: {
    uri: process.env.MONGO_URI || process.env.MONGODB_URI || null
  }
};