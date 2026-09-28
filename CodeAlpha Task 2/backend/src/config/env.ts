import dotenv from 'dotenv';

dotenv.config();

export const env: {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CLIENT_URL: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
} = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 5000),
  MONGO_URI:
    process.env.MONGO_URI ??
    (process.env.NODE_ENV === 'production'
      ? 'mongodb://127.0.0.1:27017/project-management-tool'
      : 'mongodb://127.0.0.1:27017/project-management-tool'),
  JWT_SECRET: process.env.JWT_SECRET ?? 'development-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? 'admin@example.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? 'ChangeThisPassword123!',
};
