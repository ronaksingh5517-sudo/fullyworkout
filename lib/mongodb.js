import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI is missing in environment variables.');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    // Lazy connection handling taaki startup par app crash na ho
    global._mongoClientPromise = client.connect().catch(err => {
      console.error("MongoDB Connection Failed:", err.message);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;