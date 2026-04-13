import mongoose, { Schema, Document } from 'mongoose';

export interface IPressRelease extends Document {
  title: string;
  date: Date;
  pdfBase64: string;
}

const PressReleaseSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required.'],
    default: Date.now,
  },
  pdfBase64: {
    type: String,
    required: [true, 'PDF file is required.'],
  },
}, { timestamps: true });

const PressRelease = mongoose.models.PressRelease || mongoose.model<IPressRelease>('PressRelease', PressReleaseSchema);

export default PressRelease;