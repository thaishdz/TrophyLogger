import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export interface IUser {
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  displayName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const User = model<IUser>('User', userSchema);
