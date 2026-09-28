import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export type ProjectStatus = 'active' | 'completed' | 'archived';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface IProject {
  name: string;
  description?: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  status: ProjectStatus;
  priority: ProjectPriority;
  color?: string;
  startDate?: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type IProjectDocument = HydratedDocument<IProject>;

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '' },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    color: { type: String, default: '#6366f1' },
    startDate: { type: Date },
    dueDate: { type: Date },
  },
  { timestamps: true },
);

projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ members: 1 });
projectSchema.index({ name: 'text', description: 'text' });

export const Project: Model<IProject> = model<IProject>('Project', projectSchema);
