import { User } from "../dbmanager.js";

// Using Sequelize:
export async function getUsers(req, res, next) {
  try {
    const results = await User.findAll({ limit: 500 });
    res.status(200).json(results);
  } catch (error) {
    next("Error creating user: " + error.message);
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
    res.status(200).json(newUser);
  } catch (error) {
    next("Error creating user: " + error.message);
  }
}

export async function updateUser(req, res, next) {
  const { id, username, email, password } = req.body;
  try {
    await User.update({ username, email, password }, { where: { id: id } });
    res.status(200).json("teste", username);
  } catch (error) {
    next("Error creating user: " + error.message);
  }
}

export async function deleteUser(req, res, next) {
  const { id } = req.body;
  try {
    await User.destroy({ where: { id: id } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next("Error creating user: " + error.message);
  }
}
