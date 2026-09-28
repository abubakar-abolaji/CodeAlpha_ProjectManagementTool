import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async ({ name, email, password }: RegisterInput) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  const token = generateToken(user);

  return {
    token,
    user: user.toJSON(),
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  user.lastLogin = new Date();
  await user.save();

  return {
    token: generateToken(user),
    user: user.toJSON(),
  };
};
