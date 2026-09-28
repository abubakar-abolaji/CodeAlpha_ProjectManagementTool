import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface ITask {
  title: string;
  description?: string;
  project: Types.ObjectId;
  board?: Types.ObjectId;
  column: string;
  createdBy: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  labels: string[];
  attachments: string[];
  position: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ITaskDocument = HydratedDocument<ITask>;

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, default: '' },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    board: { type: Schema.Types.ObjectId, ref: 'Board' },
    column: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['todo', 'in_progress', 'review', 'completed'], default: 'todo' },
    dueDate: { type: Date },
    labels: [{ type: String, trim: true }],
    attachments: [{ type: String }],
    position: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

taskSchema.index({ project: 1, column: 1, position: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ project: 1, dueDate: 1 });
taskSchema.index({ project: 1, status: 1, priority: 1 });
taskSchema.index({ title: 'text', description: 'text' });

export const Task: Model<ITask> = model<ITask>('Task', taskSchema);
