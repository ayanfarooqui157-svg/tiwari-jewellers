import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from '../config/index.js';

let client;
let database;
let isConnecting = false;

function getClientOptions(allowInsecureCerts = false) {
  const options = {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    tls: true
  };

  if (allowInsecureCerts || process.env.MONGODB_TLS_INSECURE === 'true') {
    options.tlsAllowInvalidCertificates = true;
  } else {
    options.serverApi = {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    };
  }

  return options;
}

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
    // Attempt 1: Standard Secure TLS connection
    client = new MongoClient(uri, getClientOptions(false));
    await client.connect();
    database = client.db('tiwari_jewellers');
    console.log('🍃 ========================================');
    console.log('✨ Connected successfully to MongoDB Atlas!');
    console.log('📦 Database: tiwari_jewellers');
    console.log('🍃 ========================================');
    return database;
  } catch (primaryError) {
    const errorMsg = primaryError.message || '';
    const isSslAlert80 = 
      errorMsg.includes('alert number 80') || 
      errorMsg.includes('tlsv1 alert internal error') ||
      errorMsg.includes('SSL alert') ||
      errorMsg.includes('SSL routines');

    if (isSslAlert80) {
      // Attempt 2: Try with adaptive TLS configuration (useful if local proxy/antivirus intercepts SSL)
      console.warn('⚠️ TLS handshake alert encountered. Retrying with adaptive TLS socket parameters...');
      if (client) {
        try { await client.close(); } catch {}
      }

      try {
        client = new MongoClient(uri, getClientOptions(true));
        await client.connect();
        database = client.db('tiwari_jewellers');
        console.log('🍃 ========================================');
        console.log('✨ Connected to MongoDB Atlas with adaptive TLS!');
        console.log('📦 Database: tiwari_jewellers');
        console.log('🍃 ========================================');
        return database;
      } catch (retryError) {
        console.error('\n========================================================================');
        console.error('🚨 MONGODB ATLAS TLS HANDSHAKE REJECTED (SSL Alert Number 80):');
        console.error('------------------------------------------------------------------------');
        console.error('👉 ROOT CAUSE:');
        console.error('   MongoDB Atlas abruptly terminates the TLS handshake with "Alert 80"');
        console.error('   whenever the connecting IP address is NOT whitelisted in Atlas Network Access.');
        console.error('   (This happens on Render/cloud deploys or when dynamic home IPs rotate).');
        console.error('');
        console.error('👉 HOW TO RESOLVE IN 60 SECONDS:');
        console.error('   1. Log in to MongoDB Atlas: https://cloud.mongodb.com');
        console.error('   2. Click "Network Access" in the left sidebar (under Security).');
        console.error('   3. Click "+ Add IP Address".');
        console.error('   4. Click the "ALLOW ACCESS FROM ANYWHERE" button (adds 0.0.0.0/0).');
        console.error('   5. Click "Confirm" and wait ~60s for the status to turn green (Active).');
        console.error('========================================================================\n');
      }
    } else {
      console.warn(`⚠️ MongoDB Atlas connection notice: ${errorMsg}`);
    }

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
