import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const authMethodSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: String,
    enum: ['steam', 'email'],
    required: true
  },
  steamId: {
    type: String,
    required: false,
    sparse: true
  },
  email: {
    type: String,
    required: false,
    sparse: true
  },
  passwordHash: {
    type: String
  }
});

// Unicidad real a nivel de colección
authMethodSchema.index({ steamId: 1 }, { unique: true, sparse: true });
authMethodSchema.index({ email: 1 }, { unique: true, sparse: true });

export const AuthMethod = model('AuthMethod', authMethodSchema);
