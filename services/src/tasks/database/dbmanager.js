import dotenv from "dotenv";
dotenv.config("./.env");
import { Sequelize, DataTypes } from "sequelize";
import defineSpace from "../models/space.js";
import defineTask from "../models/task.js";
import { syncModels, authenticationCheck } from "./dbfunctions.js";

//Connection URL
const sequelize = new Sequelize(process.env.TASKS_POSTGRES_URL);

//Models
const Space = defineSpace(sequelize, DataTypes);
const Task = defineTask(sequelize, DataTypes);

//Sync Models
await syncModels(sequelize);
await authenticationCheck(sequelize);

//Exports
export default {
  Space,
  Task,
};
