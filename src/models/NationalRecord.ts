import mongoose, { Schema, Document } from 'mongoose';

export interface INationalRecord extends Document {
  year: number;
  title: string;
  pdfBase64: string;
}

const NationalRecordSchema: Schema = new Schema({
  year: {
    type: Number,
    required: [true, 'Year is required.'],
  },
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
  },
  pdfBase64: {
    type: String,
    required: [true, 'PDF file is required.'],
  },
}, { timestamps: true });

// Force delete the old model from cache to apply schema changes immediately
if (mongoose.models.NationalRecord) {
  delete mongoose.models.NationalRecord;
}

const NationalRecord = mongoose.model<INationalRecord>('NationalRecord', NationalRecordSchema);

export default NationalRecord;