import mongoose from 'mongoose';
import { authMethodSchema } from './AuthMethod';
const { Schema, model } = mongoose;

const userSchema = new Schema ({
  displayName: {
    type: String,
    required: true
  },
  authMethods: {
    type: [authMethodSchema]
  },
  steamProfile: {
    steamId64: {
      type: String,
      required: false
    },
    apiKeyEncrypted: {
      type: String
    },
    iv: {
      type: String
    }
  }
},{
  timestamps: true
});

export const User = model('User', userSchema)
