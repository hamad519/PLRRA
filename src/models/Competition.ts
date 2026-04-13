import mongoose, { Schema, Document } from 'mongoose';

export interface ICompetition extends Document {
  title: string;
  date: Date;
  location: string;
  mainImageBase64: string; // Now required
  galleryImagesBase64?: string[]; // New field for gallery images as Base64
  description?: string;
}

const CompetitionSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Competition title is required.'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Competition date is required.'],
  },
  location: {
    type: String,
    required: [true, 'Competition location is required.'],
    trim: true,
  },
  mainImageBase64: {
    type: String,
    required: [true, 'Main image is required.'], // Now required
  },
  galleryImagesBase64: {
    type: [String], // Array of strings
    required: false, // Optional
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
}, { timestamps: true });

const Competition = mongoose.models.Competition || mongoose.model<ICompetition>('Competition', CompetitionSchema);

export default Competition;