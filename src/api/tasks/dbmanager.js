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
const Task = defineTask(sequelize, DataTypes);

// Sync Models
async function syncModels() {
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
}

//Exports
export default {
  authenticationCheck,
  syncModels,
};
