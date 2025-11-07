export default function defineTask(sequelize, DataTypes) {
  return sequelize.define("Task", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    beginDate: DataTypes.DATE,
  });
}
