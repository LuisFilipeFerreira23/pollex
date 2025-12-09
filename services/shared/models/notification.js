"use strict";

export default function defineNotification(sequelize, DataTypes) {
  return sequelize.define("Notification", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    //userId: { type: DataTypes.INTEGER, foreignKey: true },
    message: DataTypes.STRING,
    type: DataTypes.STRING,
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: DataTypes.DATE,
  });
}

// import mongoose from "mongoose";

// const Schema = mongoose.Schema;

// const notificationSchema = new Schema(
//   {
//     userId: { type: Number, required: true },
//     message: { type: String, required: true },
//     type: { type: String, required: true },
//     isRead: { type: Boolean, default: false },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { collection: "notifications" }
// );

// export const Notification = mongoose.model("Notification", notificationSchema);
