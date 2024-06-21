import mongoose, { Schema, Document } from "mongoose";
import { MessageType, MessageSchema } from "./Message";

export interface UserType extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAllowingNewMessages: boolean;
  isVerified: boolean;
  message: MessageType[];

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema: Schema<UserType> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required"],
    default: Date.now() + 360000,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAllowingNewMessages: {
    type: Boolean,
    required: [true, "isAllowingNewMessages is required"],
    default: true,
  },
  message: [MessageSchema],

  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const User =
  (mongoose.models.User as mongoose.Model<UserType>) ||
  mongoose.model<UserType>("User", UserSchema);

export default User;
