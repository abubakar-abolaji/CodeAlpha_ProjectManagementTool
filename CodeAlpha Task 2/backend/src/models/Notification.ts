import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export type NotificationType =
  | 'task_assigned'
  | 'task_updated'
  | 'task_completed'
  | 'comment_added'
  | 'mentioned'
  | 'project_invitation'
  | 'project_update'
  | 'deadline_reminder';

export interface INotification {
  user: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  project?: Types.ObjectId;
  task?: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

export type INotificationDocument = HydratedDocument<INotification>;

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'task_assigned',
        'task_updated',
        'task_completed',
        'comment_added',
        'mentioned',
        'project_invitation',
        'project_update',
        'deadline_reminder',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export const Notification: Model<INotification> = model<INotification>('Notification', notificationSchema);
