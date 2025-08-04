import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'garena-gears';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient.db(MONGODB_DB);
  }

  const client = new MongoClient(MONGODB_URI, {});
  
  try {
      cachedClient = await client.connect();
      return cachedClient.db(MONGODB_DB);
  } catch (error) {
    console.error("Failed to connect to the database", error);
    throw new Error("Failed to connect to the database");
  }
}
