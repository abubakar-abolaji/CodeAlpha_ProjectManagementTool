import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired';
export type InvitationRole = 'owner' | 'manager' | 'member' | 'viewer';

export interface IInvitation {
  project: Types.ObjectId;
  email: string;
  invitedBy: Types.ObjectId;
  role: InvitationRole;
  token: string;
  expiresAt: Date;
  status: InvitationStatus;
  createdAt: Date;
}

export type IInvitationDocument = HydratedDocument<IInvitation>;

const invitationSchema = new Schema<IInvitation>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'manager', 'member', 'viewer'], default: 'member' },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'expired'], default: 'pending' },
  },
  { timestamps: true },
);

invitationSchema.index({ project: 1, email: 1 }, { unique: false });
invitationSchema.index({ token: 1 }, { unique: true });
invitationSchema.index({ expiresAt: 1 });

export const Invitation: Model<IInvitation> = model<IInvitation>('Invitation', invitationSchema);
