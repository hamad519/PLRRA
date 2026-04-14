import mongoose, { Schema, Document } from 'mongoose';

export interface ICompetition extends Document {
  title: string;
  fromDate: Date;
  toDate: Date;
  date?: Date; // kept for backward compat with existing documents
  location: string;
  mainImageBase64: string;
  galleryImagesBase64?: string[];
  description?: string;
}

const CompetitionSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Competition title is required.'],
    trim: true,
  },
  fromDate: {
    type: Date,
    required: [true, 'From date is required.'],
  },
  toDate: {
    type: Date,
    required: [true, 'To date is required.'],
  },
  // kept for backward compat
  date: {
    type: Date,
  },
  location: {
    type: String,
    required: [true, 'Competition location is required.'],
    trim: true,
  },
  mainImageBase64: {
    type: String,
    required: [true, 'Main image is required.'],
  },
  galleryImagesBase64: {
    type: [String],
    required: false,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
}, { timestamps: true });

const Competition = mongoose.models.Competition || mongoose.model<ICompetition>('Competition', CompetitionSchema);

export default Competition;
