import db from "../util/dbmanager.js";
const { Roles } = db;

export async function getUserRole(req, res, next) {
  try {
    const { userId } = req.params;

    const userExists = await Roles.findOne({ where: { id: userId } });

    if (!userExists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const { id } = userExists;

    const role = await Roles.findOne({ where: { id } });

    return res
      .status(200)
      .json({ message: "User role retrieved successfully", role });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar permissões" });
  }
}
