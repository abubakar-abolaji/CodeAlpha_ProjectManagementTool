import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { env } from '../src/config/env.js';
import { User } from '../src/models/User.js';
import { Project } from '../src/models/Project.js';
import { ProjectMember } from '../src/models/ProjectMember.js';
import { Board } from '../src/models/Board.js';
import { Task } from '../src/models/Task.js';
import { Comment } from '../src/models/Comment.js';
import { Notification } from '../src/models/Notification.js';
import { Activity } from '../src/models/Activity.js';

dotenv.config();

const seed = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);

    const adminExists = await User.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
    if (!adminExists) {
      const hashed = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
      await User.create({
        name: 'System Admin',
        email: env.ADMIN_EMAIL.toLowerCase(),
        password: hashed,
        role: 'admin',
        isActive: true,
      });
    }

    const users = await User.find().lean();
    if (users.length === 0) {
      const john = await User.create({ name: 'John Doe', email: 'john@example.com', password: 'Password123!', role: 'user' });
      const jane = await User.create({ name: 'Jane Doe', email: 'jane@example.com', password: 'Password123!', role: 'user' });
      const mark = await User.create({ name: 'Mark Smith', email: 'mark@example.com', password: 'Password123!', role: 'user' });

      const project = await Project.create({
        name: 'Website Redesign',
        description: 'Marketing site redesign',
        owner: john._id,
        members: [john._id, jane._id],
        status: 'active',
        priority: 'high',
      });

      await ProjectMember.create({ project: project._id, user: john._id, role: 'owner' });
      await ProjectMember.create({ project: project._id, user: jane._id, role: 'member' });

      const board = await Board.create({
        project: project._id,
        name: 'Sprint Board',
        columns: [
          { id: 'todo', name: 'Todo', position: 0 },
          { id: 'in_progress', name: 'In Progress', position: 1 },
          { id: 'review', name: 'Review', position: 2 },
          { id: 'completed', name: 'Completed', position: 3 },
        ],
      });

      const task = await Task.create({
        title: 'Landing page update',
        description: 'Refresh call-to-action and pricing cards',
        project: project._id,
        board: board._id,
        column: 'todo',
        createdBy: john._id,
        assignedTo: jane._id,
        priority: 'high',
        status: 'todo',
        labels: ['marketing', 'design'],
        attachments: [],
        position: 0,
      });

      await Comment.create({
        task: task._id,
        user: jane._id,
        content: 'I can take the first pass on the hero copy.',
      });

      await Notification.create({
        user: jane._id,
        type: 'task_assigned',
        title: 'Task assigned',
        message: 'You were assigned the landing page update task.',
        project: project._id,
        task: task._id,
      });

      await Activity.create({
        user: john._id,
        project: project._id,
        task: task._id,
        action: 'Task created',
        description: 'Created landing page update task.',
      });

      await Task.create({
        title: 'API integration',
        description: 'Connect dashboard widgets to backend endpoints.',
        project: project._id,
        board: board._id,
        column: 'in_progress',
        createdBy: john._id,
        assignedTo: mark._id,
        priority: 'medium',
        status: 'in_progress',
        labels: ['backend'],
        position: 0,
      });
    }

    console.log('Seed completed successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

void seed();
