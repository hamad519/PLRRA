import mongoose, { Schema, Document } from 'mongoose';

export interface IMatchResult {
  name: string;
  pdfBase64: string; // PDF file as Base64 string
  details?: string;
}

export interface IPastResultRecord extends Document {
  title: string;
  date: Date;
  location: string;
  matches: IMatchResult[];
}

const MatchResultSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Match name is required.'],
    trim: true,
  },
  pdfBase64: {
    type: String,
    required: [true, 'PDF file is required.'],
  },
  details: {
    type: String,
    trim: true,
  },
}, { _id: false }); // Don't create _id for subdocuments if not needed

const PastResultRecordSchema: Schema = new Schema({
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
  matches: {
    type: [MatchResultSchema],
    required: [true, 'At least one match result is required.'],
  },
}, { timestamps: true });

const PastResultRecord = mongoose.models.PastResultRecord || mongoose.model<IPastResultRecord>('PastResultRecord', PastResultRecordSchema);

export default PastResultRecord;