import db from "../util/dbmanager.js";
const { Space } = db;

export async function getSpaces(req, res, next) {
  try {
    const results = await Space.findAll({ limit: 10 });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function getSpaceById(req, res, next) {
  const { id } = req.params;
  try {
    const results = await Space.findAll({ where: { id: id } });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function addSpace(req, res, next) {
  const { title, description, creatorId } = req.body;
  try {
    const results = await Space.create({ title, description, creatorId });
    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function updateSpace(req, res, next) {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const [results] = await Space.update(
      { title: title, description: description },
      { where: { id: id } }
    );
    if (results === 0) {
      return res.status(404).json({ message: "Space not found" });
    }
    return res.status(200).json({ message: "Space updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function deleteSpace(req, res, next) {
  const { id } = req.params;
  try {
    const results = await Space.destroy({ where: { id: id } });
    if (results === 0) {
      return res.status(404).json({ message: "Space not found" });
    }
    return res.status(200).json({ message: "Space deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function getList(req, res, next) {
  return res.status(200).json({ message: "getList not implemented yet" });
}

export async function editSpace(req, res, next) {
  return res.status(200).json({ message: "editSpace not implemented yet" });
}

export async function getKanban(req, res, next) {
  return res.status(200).json({ message: "getKanban not implemented yet" });
}

export async function addKanban(req, res, next) {
  return res.status(200).json({ message: "addKanban not implemented yet" });
}

export async function editKanban(req, res, next) {
  return res.status(200).json({ message: "editKanban not implemented yet" });
}

export async function updateKanban(req, res, next) {
  return res.status(200).json({ message: "updateKanban not implemented yet" });
}
