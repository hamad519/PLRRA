import mongoose, { Schema, Document } from 'mongoose';

interface IWeapon {
  nomenclature: string;
  caliber: string;
  bodyNumber: string;
  madeBy: string;
}

export interface IEventRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  fatherName: string;
  religion: string;
  dateOfBirth: Date;
  profession: string;
  addressLine1: string;
  city: string;
  state: string;
  phoneNo: string;
  email: string;
  cnicNo: string;
  cnicCopyBase64: string;
  passportNo?: string;
  passportCopyBase64?: string;
  weapons: IWeapon[];
  weaponLicenseCopyBase64: string;
  bankChallanCopyBase64: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

const WeaponSchema: Schema = new Schema({
  nomenclature: { type: String, required: true },
  caliber: { type: String, required: true },
  bodyNumber: { type: String, required: true },
  madeBy: { type: String, required: true },
}, { _id: false });

const EventRegistrationSchema: Schema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fatherName: { type: String, required: true },
  religion: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  profession: { type: String, required: true },
  addressLine1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  phoneNo: { type: String, required: true },
  email: { type: String, required: true },
  cnicNo: { type: String, required: true },
  cnicCopyBase64: { type: String, required: true },
  passportNo: { type: String },
  passportCopyBase64: { type: String },
  weapons: { type: [WeaponSchema], required: true },
  weaponLicenseCopyBase64: { type: String, required: true },
  bankChallanCopyBase64: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const EventRegistration = mongoose.models.EventRegistration || mongoose.model<IEventRegistration>('EventRegistration', EventRegistrationSchema);

export default EventRegistration;