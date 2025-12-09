import { Sequelize, DataTypes } from "sequelize";
import defineSpace from "../models/space.js";
import defineTask from "../models/task.js";

//Connection URL
const sequelize = new Sequelize(
  "postgres://postgres:postgres@postgres-tasks:5431/pollex-tasks"
);

//Auth Check
async function authenticationCheck() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

////Models
const Space = defineSpace(sequelize, DataTypes);
const Task = defineTask(sequelize, DataTypes);

//Sync Models
async function syncModels() {
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
}

//Exports
export default {
  authenticationCheck,
  syncModels,
};
