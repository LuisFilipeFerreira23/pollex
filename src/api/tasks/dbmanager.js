//POSTGRESQL
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOSTNAME,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: String(process.env.POSTGRES_PASSWORD),
  database: process.env.POSTGRES_DATABASE,
});

//SEQUELIZE
import { Sequelize, DataTypes } from "sequelize";
import defineTask from "./models/task.js";
import defineNotification from "./models/notification.js";
import defineSpace from "./models/space.js";
import defineUser from "./models/user.js";
import defineDoc from "./models/doc.js";

//Connection URL
const sequelize = new Sequelize(
  "postgres://postgres:postgres@pollex-postgres:5432/pollex-tasks"
);

async function authenticationCheck() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

//Define Models
const Notification = defineNotification(sequelize, DataTypes);
const Space = defineSpace(sequelize, DataTypes);
const Task = defineTask(sequelize, DataTypes);
const User = defineUser(sequelize, DataTypes);
const Doc = defineDoc(sequelize, DataTypes);

// Sync Models
async function syncModels() {
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
}

//Exports
export default {
  pool,
  authenticationCheck,
  syncModels,
  defineTask,
  Task,
};
