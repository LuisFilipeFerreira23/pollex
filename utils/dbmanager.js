//SEQUELIZE
import { Sequelize, DataTypes } from "sequelize";
import defineTask from "../../models/task.js";
import defineNotification from "../models/notification.js";
import defineSpace from "../../models/space.js";
import defineUser from "../models/user.js";
import defineComments from "../models/comments.js";
import defineDoc from "../models/doc.js";
import { Notification } from "../models/notification.js";
import defineRoles from "../models/roles.js";

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
//POSTGRESQL
const Roles = defineRoles(sequelize, DataTypes);
const Space = defineSpace(sequelize, DataTypes);
export const Task = defineTask(sequelize, DataTypes);
const User = defineUser(sequelize, DataTypes);

// MONGOOSE
const Doc = defineDoc(sequelize, DataTypes);
const Comments = defineComments(sequelize, DataTypes);
const Notification = defineNotification(sequelize, DataTypes);

// Sync Models
async function syncModels() {
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
  await setRoles();
}

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

//Exports
export default {
  authenticationCheck,
  syncModels,
  defineTask,
  Task,
  User,
  Space,
  Notification,
  Comments,
  Doc,
  Roles,
};
