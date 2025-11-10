export default function defineNotification(sequelize, DataTypes) {
  return sequelize.define("Notification", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    type: DataTypes.STRING,
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: DataTypes.DATE,
  });
}
