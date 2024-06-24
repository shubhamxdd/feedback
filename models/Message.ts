import mongoose, { Schema, Document } from "mongoose";

export interface MessageType extends Document {
  message: string;
  createdAt: Date;
}

export const MessageSchema: Schema<MessageType> = new Schema({
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
