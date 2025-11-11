import { Space } from "../dbmanager.js";

export async function getSpaces(req, res, next) {
  try {
    const results = await Space.findAll({ limit: 10 });
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}

export async function getSpaceById(req, res, next) {
  const { id } = req.params;
  try {
    const results = await Space.findAll({ where: { id: id } });
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}

export async function addSpace(req, res, next) {
  const { title, description, creatorId } = req.body;
  try {
    const results = await Space.create({ title, description, creatorId });
    return res.status(200).json({ results });
  } catch (error) {
    return next(error);
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
    res.status(200).json({ message: "Space updated successfully" });
  } catch (error) {
    next(error);
  }
}

export async function deleteSpace(req, res, next) {
  const { id } = req.params;
  try {
    const results = await Space.destroy({ where: { id: id } });
    if (results === 0) {
      return res.status(404).json({ message: "Space not found" });
    }
    res.status(200).json({ message: "Space deleted successfully" });
  } catch (error) {
    next(error);
  }
}
