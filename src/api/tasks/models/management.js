export default function defineManagement(sequelize, DataTypes) {
  return sequelize.define("Management", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role: DataTypes.STRING,
    canCreate: DataTypes.BOOLEAN,
    canEdit: DataTypes.BOOLEAN,
    canDelete: DataTypes.BOOLEAN,
  });
}
