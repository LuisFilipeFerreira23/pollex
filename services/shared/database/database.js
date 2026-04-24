// Verifies that the database connection is established and working correctly.
export async function authenticationCheck(sequelize) {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// Synchronizes all Sequelize models with the database schema.
// The { alter: true } option automatically adds/modifies columns to match the model definitions.
export async function syncModels(sequelize) {
  await sequelize.sync({ alter: true });
  console.log("All models were synchronized successfully.");
}
