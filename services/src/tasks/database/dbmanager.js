import { Sequelize, DataTypes } from "sequelize";
import defineSpace from "../models/space.js";
import defineTask from "../models/task.js";
import { syncModels, authenticationCheck } from "./dbfunctions.js";

//Connection URL
if (!process.env.TASKS_POSTGRES_URL) {
  try {
    const dotenv = await import("dotenv");
    dotenv.config({ path: "./.env", override: false });
  } catch (e) {
    console.warn(
      "TASKS_POSTGRES_URL not found and dotenv import failed. Check environment setup."
    );
  }
}

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
