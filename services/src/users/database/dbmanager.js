import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
import defineUser from "../models/user.js";
import defineRoles from "../models/roles.js";

dotenv.config("./.env");

//Connection URL
const users = new Sequelize(
  "postgres://" +
    process.env.USERS_POSTGRES_USER +
    ":" +
    process.env.USERS_POSTGRES_PASSWORD +
    "@" +
    process.env.USERS_POSTGRES_HOSTNAME +
    ":" +
    process.env.USERS_POSTGRES_PORT +
    "/" +
    process.env.USERS_POSTGRES_DATABASE
);

async function authenticationCheck() {
  try {
    await users.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

//Define Models
const User = defineUser(users, DataTypes);
const Roles = defineRoles(users, DataTypes);

async function setRoles() {
  const defaultRoles = [
    { id: 1, role: "admin", canCreate: true, canEdit: true, canDelete: true },
    {
      id: 2,
      role: "manager",
      canCreate: true,
      canEdit: true,
      canDelete: false,
    },
    { id: 3, role: "editor", canCreate: true, canEdit: true, canDelete: false },
    {
      id: 4,
      role: "viewer",
      canCreate: false,
      canEdit: false,
      canDelete: false,
    },
    {
      id: 5,
      role: "contributor",
      canCreate: true,
      canEdit: false,
      canDelete: false,
    },
  ];

  const existingCount = await Roles.count();
  if (existingCount === 0) {
    await Roles.bulkCreate(defaultRoles);
    console.log("Roles criado com sucesso!");
  } else {
    console.log("Roles já existem.");
  }
}

// Sync Models
async function syncModels() {
  await users.sync({ force: true });
  console.log("All models were synchronized successfully.");
  await setRoles();
  console.log("Roles set up completed.");
}

//Exports
export default {
  authenticationCheck,
  syncModels,
};
