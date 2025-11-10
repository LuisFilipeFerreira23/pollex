import { Task } from "../dbmanager.js";

export async function getTasks(req, res, next) {
  try {
    const results = await Task.findAll({ limit: 10 });
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req, res, next) {
  const { id } = req.params;
  try {
    const results = await Task.findAll({ where: { id: id } });
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}

export async function addTask(req, res, next) {
  const { name } = req.body;
  try {
    const results = await Task.create({ name });
    return res.status(201).json({ results });
  } catch (error) {
    return next(error);
  }
}

export async function updateTask(req, res, next) {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await Task.update({ name: name }, { where: { id: id } });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  const { id } = req.params;
  try {
    await Task.destroy({ where: { id: id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
}
