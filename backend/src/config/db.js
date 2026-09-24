import mongoose from 'mongoose';

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cow_assistant';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500, // Quick 2.5s check for local Mongo server
    });
    console.log(`[MongoDB] Connected to database at: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Primary MongoDB connection failed (${error.message}).`);
    console.log('[MongoDB Memory Server] Initializing in-memory database for seamless local operation...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();

      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB Memory Server] Connected successfully to in-memory database at: ${uri}`);
      return true;
    } catch (memErr) {
      console.error('[MongoDB Critical Error] Failed to launch in-memory database:', memErr.message);
      return false;
    }
  }
};

export default connectDB;
