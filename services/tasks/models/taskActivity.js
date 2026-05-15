export default function defineTaskActivity(sequelize, DataTypes) {
    return sequelize.define('TaskActivity', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        taskId: { type: DataTypes.INTEGER, allowNull: false },
        actorUserId: { type: DataTypes.INTEGER, allowNull: false },
        actionType: { type: DataTypes.STRING, allowNull: false },
        fieldName: { type: DataTypes.STRING, allowNull: true },
        oldValue: { type: DataTypes.JSON, allowNull: true },
        newValue: { type: DataTypes.JSON, allowNull: true },
        metadata: { type: DataTypes.JSON, allowNull: true },
    });
}
