export default function defineRoles(sequelize, DataTypes) {
  return sequelize.define(
    "Roles",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      role: DataTypes.STRING,
      canCreate: DataTypes.BOOLEAN,
      canEdit: DataTypes.BOOLEAN,
      canDelete: DataTypes.BOOLEAN,
    },
    { timestamps: false }
  );
}
