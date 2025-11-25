//SEQUELIZE
import { Sequelize, DataTypes } from "sequelize";
import defineTask from "../models/task.js";
import defineNotification from "../models/notification.js";
import defineSpace from "../models/space.js";
import defineUser from "../models/user.js";
import defineComments from "../models/comments.js";
//import defineDoc from "../models/doc.js";
import defineManagement from "../models/roles.js";

//Connection URL
const sequelize = new Sequelize(
  "postgres://postgres:1234@pollex-postgres:5432/pollex-tasks"
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
//const Comments = defineComments(sequelize, DataTypes);
const Roles = defineRoles(sequelize, DataTypes);
const Space = defineSpace(sequelize, DataTypes);
export const Task = defineTask(sequelize, DataTypes);
const User = defineUser(sequelize, DataTypes);
//const Doc = defineDoc(sequelize, DataTypes);

//Relationships
//User
User.belongsTo(Roles, { foreignKey: "roleId" });

//Task
Task.belongsTo(Space, { foreignKey: "spaceId" });
//Task.belongsTo(Notification, { foreignKey: "notificationId" }); NOTIFS É MONGODB AGR

//Space
Space.belongsTo(User, { foreignKey: "creatorId" });

//Comments (É MONGODB TMB)
//Comments.belongsTo(User, { foreignKey: "userId" });

//Documents (É MONGODB TMB)
//Doc.hasMany(Task, { foreignKey: "documentationId" });
//Task.belongsTo(Doc, { foreignKey: "documentationId" });

// Sync Models
async function syncModels() {
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
  await setRoles();
}

async function setRoles() {
  const defaultRoles = [
    { id: 1, role: "Admin", canCreate: true, canEdit: true, canDelete: true },
    {
      id: 2,
      role: "Manager",
      canCreate: true,
      canEdit: true,
      canDelete: false,
    },
    { id: 3, role: "Editor", canCreate: true, canEdit: true, canDelete: false },
    {
      id: 4,
      role: "Viewer",
      canCreate: false,
      canEdit: false,
      canDelete: false,
    },
    {
      id: 5,
      role: "Contributor",
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
  //Doc,
  Roles,
};
