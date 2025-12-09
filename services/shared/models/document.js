/* //PARA APAGAR MAIS TARDE - GRIDFS CRIA AS COLLECTIONS AUTOMATICAMENTE
export default function defineDoc(sequelize, DataTypes) {
  return sequelize.define("Doc", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    content: DataTypes.BLOB("long"),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
}
 */

import { Schema } from "mongoose";

export const documentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: Buffer },
  },
  { timestamps: true }
);
