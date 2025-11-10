export default function defineSpace(sequelize, DataTypes) {
  return sequelize.define("Space", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
  });
}
