import mongoose from 'mongoose';
const { Schema } = mongoose;


export const authMethodSchema = new Schema({
  provider: {
    type: String,
    enum: ['steam', 'email'],
    required: true
  },
  steamId: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  passwordHash: {
    type: String
  }
});
