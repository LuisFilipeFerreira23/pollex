export default function defineTask(sequelize, DataTypes) {
  return sequelize.define("Task", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    due_date: DataTypes.DATE,
    documentation_Id: DataTypes.INTEGER,
    create_at: DataTypes.DATE,
    update_at: DataTypes.DATE,
  });
}
