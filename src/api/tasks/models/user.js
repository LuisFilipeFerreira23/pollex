export default function defineUser(sequelize, DataTypes) {
  return sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: { type: DataTypes.STRING, requires: true },
    email: { type: DataTypes.STRING, requires: true },
    password: { type: DataTypes.STRING, requires: true },
    roleId: { type: DataTypes.INTEGER, foreignKey: true, requires: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
}
