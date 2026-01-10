import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const mongoUrl = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME;

  if (!mongoUrl || !dbName) {
    throw new Error('MONGO_URL and DB_NAME must be set in environment variables');
  }

  try {
    client = new MongoClient(mongoUrl);
    await client.connect();
    db = client.db(dbName);

    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error: any) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('   Make sure MongoDB is running and MONGO_URL is correct');
    throw error;
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not connected. MongoDB may not be running or connection failed.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Disconnected from MongoDB');
  }
}
