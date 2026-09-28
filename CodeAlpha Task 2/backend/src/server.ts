import { app, httpServer, io } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    httpServer.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
      console.log(`Socket.io enabled for ${env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
};

void startServer();

export { io };
