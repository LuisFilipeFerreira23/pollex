import db from "../util/dbmanager.js";
const { Management } = db;

export async function getManagement(req, res, next) {
  try {
    const management = await Management.findAll();
    res.json(management);
  } catch (error) {
    console.error("Erro ao buscar permissões:", error);
    res.status(500).json({ error: "Erro ao buscar permissões" });
  }
}
