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
  const { name } = req.body; // validate as needed
  try {
    const results = await Task.create({ name }); // capture the result
    return res.status(200).json({ results }); // send response
  } catch (error) {
    return next(error);
  }
}

export async function updateTask(req, res, next) {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const results = await Task.update({ title: title }, { where: { id: id } });
    if (results === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  const { id } = req.params;
  try {
    const results = await Task.destroy({ where: { id: id } });
    if (results === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
}
