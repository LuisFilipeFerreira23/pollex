import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
import defineUser from "../models/user.js";
import defineRoles from "../models/roles.js";
import { syncModels, authenticationCheck } from "./database.js";

dotenv.config("./.env");

//Connection URL
const sequelize = new Sequelize(process.env.USERS_POSTGRES_URL);

//Models
const User = defineUser(sequelize, DataTypes);
const Roles = defineRoles(sequelize, DataTypes);

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

//Sync Models
await syncModels(sequelize);
await authenticationCheck(sequelize);
await setRoles(sequelize);

//Exports
export default {
  User,
  Roles,
};
