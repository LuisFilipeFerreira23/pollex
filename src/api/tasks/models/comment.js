"use strict";

/* 
export default function defineComments(sequelize, DataTypes) {
  return sequelize.define("Comment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: DataTypes.STRING,
    taskId: { type: DataTypes.INTEGER, foreignKey: true },
    userId: { type: DataTypes.INTEGER, foreignKey: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
}
*/

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    taskId: { type: Number, required: true },
    userId: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "comments" }
);

export const Comment = mongoose.model("Comment", commentSchema);
