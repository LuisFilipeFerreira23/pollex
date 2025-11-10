export default function defineNotification(sequelize, DataTypes) {
  return sequelize.define("Notification", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message: DataTypes.STRING,
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: DataTypes.DATE,
  });
}
