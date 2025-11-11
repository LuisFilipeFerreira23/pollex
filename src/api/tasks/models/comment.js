export default function defineComment(sequelize, DataTypes) {
  return sequelize.define("Comment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: DataTypes.TEXT,
    taskId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
}
