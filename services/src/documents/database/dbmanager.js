import { Sequelize, DataTypes } from "sequelize";
import defineDocument from "../models/doc.js";
//Define Models
const Document = defineDocument(sequelize, DataTypes);
//Connection URL
const sequelize = new Sequelize(
  "postgres://postgres:postgres@pollex-postgres:5432/pollex-tasks"
);

//Exports
export default {
  authenticationCheck,
  syncModels,
  Doc: Document,
};
