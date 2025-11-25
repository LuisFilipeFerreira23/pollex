export default function defineTask(sequelize, DataTypes) {
  return sequelize.define("Task", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    dueDate: DataTypes.DATE,
    spaceId: { type: DataTypes.INTEGER, foreignKey: true },
    documentationId: { type: DataTypes.INTEGER, foreignKey: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
}
