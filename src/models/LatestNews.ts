import mongoose, { Schema, Document } from 'mongoose';

export interface ILatestNews extends Document {
  title: string;
  date: Date;
  isActive: boolean;
}

const LatestNewsSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'News title is required.'],
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const LatestNews = mongoose.models.LatestNews || mongoose.model<ILatestNews>('LatestNews', LatestNewsSchema);

export default LatestNews;
