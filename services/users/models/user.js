// Defines the User model for Sequelize ORM, representing the users table in the database.
export default function defineUser(sequelize, DataTypes) {
  return sequelize.define("User", {
    // Auto-incrementing primary key for the user record
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Username for the user account
    username: { type: DataTypes.STRING, requires: true },
    // Email address used for login and communication
    email: { type: DataTypes.STRING, requires: true },
    // Hashed password for secure authentication
    password: { type: DataTypes.STRING, requires: true },
    // Foreign key reference to the Roles table for role-based access control
    roleId: { type: DataTypes.INTEGER, foreignKey: true, requires: true },
    // Hashed refresh token used to obtain new access tokens; nullable if not logged in
    refreshToken: { type: DataTypes.TEXT, allowNull: true },
    // Current access token stored for token revocation on logout; nullable if not logged in
    accessToken: { type: DataTypes.TEXT, allowNull: true },
    // Automatically managed timestamps for record creation and updates
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
}
