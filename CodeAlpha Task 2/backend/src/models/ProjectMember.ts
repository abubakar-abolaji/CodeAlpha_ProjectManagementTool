import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export type ProjectMemberRole = 'owner' | 'manager' | 'member' | 'viewer';

export interface IProjectMember {
  project: Types.ObjectId;
  user: Types.ObjectId;
  role: ProjectMemberRole;
  joinedAt: Date;
}

export type IProjectMemberDocument = HydratedDocument<IProjectMember>;

const projectMemberSchema = new Schema<IProjectMember>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'manager', 'member', 'viewer'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

projectMemberSchema.index({ project: 1, user: 1 }, { unique: true });
projectMemberSchema.index({ project: 1, role: 1 });
projectMemberSchema.index({ user: 1 });

export const ProjectMember: Model<IProjectMember> = model<IProjectMember>('ProjectMember', projectMemberSchema);
