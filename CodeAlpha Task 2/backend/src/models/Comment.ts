import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export interface IComment {
  task: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  mentions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type ICommentDocument = HydratedDocument<IComment>;

const commentSchema = new Schema<IComment>(
  {
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

commentSchema.index({ task: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

export const Comment: Model<IComment> = model<IComment>('Comment', commentSchema);
