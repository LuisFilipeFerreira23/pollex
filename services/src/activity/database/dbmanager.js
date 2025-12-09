//SEQUELIZE
import { Sequelize, DataTypes } from "sequelize";
import defineTask from "../models/task.js";
import defineSpace from "../models/space.js";

//Connection URL
const sequelize = new Sequelize(
  "postgres://postgres:postgres@pollex-postgres:5432/pollex-tasks"
);

export const Space = defineSpace(sequelize, DataTypes);
export const Task = defineTask(sequelize, DataTypes);

//Task
Task.belongsTo(Space, { foreignKey: "spaceId" });
//Task.belongsTo(Notification, { foreignKey: "notificationId" }); NOTIFS É MONGODB AGR

//Space
Space.belongsTo(User, { foreignKey: "creatorId" });

// Sync Models
async function syncModels() {
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
  await setRoles();
}
