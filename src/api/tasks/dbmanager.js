//POSTGRESQL
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOSTNAME,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: String(process.env.POSTGRES_PASSWORD),
  database: process.env.POSTGRES_DATABASE,
});

async function createDatabase() {
  try {
    await pool.connect();
    await pool.query('CREATE DATABASE "pollex-tasks"');
    console.log("Database created successfully");
  } catch (err) {
    if (err.code === "42P04") {
      // duplicate_database error
      console.log("Database already exists");
    } else {
      console.error("Error creating database:", err);
    }
  }
}

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
  createDatabase,
  authenticationCheck,
  syncModels,
};
