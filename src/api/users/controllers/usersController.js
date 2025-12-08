import db from "../../util/dbmanager.js";
const { User } = db;

// Using Sequelize:
export async function getUsers(req, res, next) {
  try {
    const results = await User.findAll({ limit: 500 });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function createUser(req, res, next) {
  const { username, email, password } = req.body;
  try {
    const newUser = await User.create({
      username,
      email,
      password,
    });
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function updateUser(req, res, next) {
  const { id, username, email, password } = req.body;
  try {
    await User.update({ username, email, password }, { where: { id: id } });
    return res.status(200).json({ message: "teste", username });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function deleteUser(req, res, next) {
  const { id } = req.body;
  try {
    await User.destroy({ where: { id: id } });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}
