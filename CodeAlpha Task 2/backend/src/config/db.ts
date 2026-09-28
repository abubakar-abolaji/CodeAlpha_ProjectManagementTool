import mongoose from 'mongoose';
import { env } from './env.js';

const getMongoUri = (): string => {
  const configured = process.env.MONGO_URI?.trim();
  if (configured) return configured;

  const fallback = 'mongodb://127.0.0.1:27017/project-management-tool';
  console.warn(`MONGO_URI not set; falling back to ${fallback}`);
  return fallback;
};

export const connectDatabase = async (): Promise<void> => {
  try {
    const uri = getMongoUri();
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw new Error('MongoDB is unavailable. Check the Atlas IP allowlist, cluster status, and database credentials.');
  }
};
