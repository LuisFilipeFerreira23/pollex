export async function authenticationCheck(sequelize) {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// Sync Models
export async function syncModels(sequelize) {
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
}
