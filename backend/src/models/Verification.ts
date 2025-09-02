import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVerification extends Document {
  plateNumber: string;
  recognizedPlate: string;
  confidence: number;
  imageUrl: string;
  isMatch: boolean;
  verifiedBy: Types.ObjectId;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
}

const verificationSchema: Schema = new Schema({
  plateNumber: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  recognizedPlate: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  imageUrl: {
    type: String,
    required: true
  },
  isMatch: {
    type: Boolean,
    required: true
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IVerification>('Verification', verificationSchema);