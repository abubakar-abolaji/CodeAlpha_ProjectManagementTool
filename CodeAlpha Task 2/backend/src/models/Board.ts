import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export interface IBoardColumn {
  id: string;
  name: string;
  position: number;
}

export interface IBoard {
  project: Types.ObjectId;
  name: string;
  description?: string;
  columns: IBoardColumn[];
  createdAt: Date;
  updatedAt: Date;
}

export type IBoardDocument = HydratedDocument<IBoard>;

const boardColumnSchema = new Schema<IBoardColumn>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    position: { type: Number, required: true },
  },
  { _id: false },
);

const boardSchema = new Schema<IBoard>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    columns: { type: [boardColumnSchema], default: [] },
  },
  { timestamps: true },
);

boardSchema.index({ project: 1, name: 1 });

export const Board: Model<IBoard> = model<IBoard>('Board', boardSchema);
