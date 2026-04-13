import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: Date;
  location: string;
  mainImageBase64: string;
  description?: string;
}

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Event title is required.'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Event date is required.'],
  },
  location: {
    type: String,
    required: [true, 'Event location is required.'],
    trim: true,
  },
  mainImageBase64: {
    type: String,
    required: [true, 'Main image is required.'],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
}, { timestamps: true });

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;