import mongoose, { Schema, Document } from 'mongoose';

interface IWeapon {
  nomenclature: string;
  caliber: string;
  bodyNumber: string;
  madeBy: string;
}

export interface IMembershipApplication extends Document {
  membershipPlan: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  religion: string;
  dateOfBirth: Date;
  profession: string;
  addressLine1: string;
  city: string;
  state: string;
  jobBusinessAddress: string;
  presentHomeAddress: string;
  permanentHomeAddress: string;
  cnicNo: string;
  cnicCopyBase64: string; // Stored as Base64
  passportNo?: string;
  passportCopyBase64?: string; // Stored as Base64
  phoneNo: string;
  email: string;
  weapons: IWeapon[];
  weaponLicenseCopyBase64: string; // Stored as Base64
  membershipFeeYear: string;
  bankChallanCopyBase64: string; // Stored as Base64
  status: 'pending' | 'approved' | 'rejected'; // New field for application status
  submittedAt: Date;
}

const WeaponSchema: Schema = new Schema({
  nomenclature: { type: String, required: true },
  caliber: { type: String, required: true },
  bodyNumber: { type: String, required: true },
  madeBy: { type: String, required: true },
}, { _id: false });

const MembershipApplicationSchema: Schema = new Schema({
  membershipPlan: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fatherName: { type: String, required: true },
  religion: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  profession: { type: String, required: true },
  addressLine1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  jobBusinessAddress: { type: String, required: true },
  presentHomeAddress: { type: String, required: true },
  permanentHomeAddress: { type: String, required: true },
  cnicNo: { type: String, required: true },
  cnicCopyBase64: { type: String, required: true },
  passportNo: { type: String },
  passportCopyBase64: { type: String },
  phoneNo: { type: String, required: true },
  email: { type: String, required: true },
  weapons: { type: [WeaponSchema], required: true },
  weaponLicenseCopyBase64: { type: String, required: true },
  membershipFeeYear: { type: String, required: true },
  bankChallanCopyBase64: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const MembershipApplication = mongoose.models.MembershipApplication || mongoose.model<IMembershipApplication>('MembershipApplication', MembershipApplicationSchema);

export default MembershipApplication;