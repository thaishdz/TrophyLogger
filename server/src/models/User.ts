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
},{
  timestamps: true
});

export const User = model('User', userSchema)
