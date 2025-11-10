export default function defineSpace(sequelize, DataTypes) {
  return sequelize.define("Space", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    creator_id: DataTypes.INTEGER,
    create_at: DataTypes.DATE,
  });
}
