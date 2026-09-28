import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { IUserDocument } from '../models/User.js';

export const generateToken = (user: IUserDocument): string =>
  jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET as jwt.Secret,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
  );
