import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  address: string;
  contactNo: string;
  email: string;
  workingHours: string;
  facebookLink: string;
  instagramLink: string;
  isMaintenanceMode: boolean;
  // Content Fields
  plraIntro: string;
  stats: {
    nationalRecords: string;
    internationalMedals: string;
    eliteShooters: string;
    growthRate: string;
  };
  championMoments: Array<{ title: string; imageBase64: string }>;
  heroSlides: Array<{ title: string; subtitle: string; description: string; imageBase64: string }>;
}

const SiteSettingsSchema: Schema = new Schema({
  address: { type: String, default: 'Pakistan Long Range Rifle Association C/O Army Marksmanship Unit Jhelum Cantonment' },
  contactNo: { type: String, default: '0092-544-620081' },
  email: { type: String, default: 'plra.pakistan2022@gmail.com' },
  workingHours: { type: String, default: 'Monday to Friday: 7am – 7pm' },
  facebookLink: { type: String, default: 'https://facebook.com' },
  instagramLink: { type: String, default: 'https://instagram.com' },
  isMaintenanceMode: { type: Boolean, default: false },
  plraIntro: { type: String, default: '' },
  stats: {
    nationalRecords: { type: String, default: '0' },
    internationalMedals: { type: String, default: '0' },
    eliteShooters: { type: String, default: '0' },
    growthRate: { type: String, default: '0%' },
  },
  championMoments: {
    type: [{ title: String, imageBase64: String }],
    default: []
  },
  heroSlides: {
    type: [{ title: String, subtitle: String, description: String, imageBase64: String }],
    default: []
  }
}, { timestamps: true });

// Force delete the old model from cache to apply schema changes immediately
if (mongoose.models.SiteSettings) {
  delete mongoose.models.SiteSettings;
}

const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;