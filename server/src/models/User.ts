import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  displayName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const User = model('User', userSchema);
