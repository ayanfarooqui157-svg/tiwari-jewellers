import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from '../config/index.js';

let client;
let database;
let isConnecting = false;

export async function connectDB() {
  if (database) return database;
  if (isConnecting) return null;

  const uri = config.mongodb.uri;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not defined in server environment. Running in offline JSON store mode.');
    return null;
  }

  isConnecting = true;

  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
      },
      connectTimeoutMS: 8000,
      serverSelectionTimeoutMS: 8000
    });

    await client.connect();
    // Default to 'tiwari_jewellers' database
    database = client.db('tiwari_jewellers');
    console.log('🍃 ========================================');
    console.log('✨ Connected successfully to MongoDB Atlas!');
    console.log('📦 Database: tiwari_jewellers');
    console.log('🍃 ========================================');
    return database;
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas connection notice: ${error.message}`);
    console.warn('📦 Server will continue operating using local persistent vault engine (data/db.json).');
    if (client) {
      try { await client.close(); } catch {}
      client = undefined;
    }
    database = undefined;
    return null;
  } finally {
    isConnecting = false;
  }
}

export function isConnected() {
  return !!database;
}

export function getDB() {
  return database || null;
}

export function getCollection(name) {
  if (!database) return null;
  return database.collection(name);
}

export async function closeDB() {
  if (client) {
    try {
      await client.close();
    } catch (e) {
      console.error('Error closing MongoDB connection:', e);
    }
    client = undefined;
    database = undefined;
  }
}
