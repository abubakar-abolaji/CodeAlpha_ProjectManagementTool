import { connectDatabase } from './db.js';
import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
  default: {
    connect: jest.fn(),
  },
}));

describe('connectDatabase', () => {
  it('connects to the configured MongoDB URI', async () => {
    const connect = jest.mocked(mongoose.connect);
    connect.mockResolvedValue({} as never);

    await connectDatabase();

    expect(connect).toHaveBeenCalledWith(process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/project-management-tool');
  });
});
