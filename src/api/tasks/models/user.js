export default function defineUser(sequelize, DataTypes) {
  return sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    //role_id: { type: DataTypes.INTEGER, foreignKey: true },
    create_at: DataTypes.DATE,
    update_at: DataTypes.DATE,
  });
}
