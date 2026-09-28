import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export interface IActivity {
  user: Types.ObjectId;
  project?: Types.ObjectId;
  task?: Types.ObjectId;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type IActivityDocument = HydratedDocument<IActivity>;

const activitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
    action: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

activitySchema.index({ project: 1, createdAt: -1 });
activitySchema.index({ task: 1, createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });

export const Activity: Model<IActivity> = model<IActivity>('Activity', activitySchema);
