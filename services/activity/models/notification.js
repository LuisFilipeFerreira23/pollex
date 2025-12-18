"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: { type: Number, required: true },
    message: { type: String, required: true },
    type: { type: Number, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "notifications" }
);

export const Notification = mongoose.model("Notification", notificationSchema);
