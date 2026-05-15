import dbmanager from "../database/dbmanager.js";
import { fn, col, Op } from 'sequelize'; 

const { Task } = dbmanager;

export async function getTasks(req, res, next) {
  try {
    const id = req.query.id || req.params.id;

    if (id) {
      const task = await Task.findOne({ where: { id } });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.status(200).json(task);
    }

    const results = await Task.findAll({ limit: 10 });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function getTaskById(req, res, next) {
  const id = req.params.id || req.query.id;

  if (!id) {
    return res.status(400).json({ message: "Missing task id" });
  }

  try {
    const result = await Task.findOne({ where: { id } });

    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function addTask(req, res, next) {
  const { title } = req.body;
  try {
    const results = await Task.create({ title });
    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function updateTask(req, res, next) {
  const { id } = req.params;
  const { title, status, createdAt } = req.body;

  try {
    const results = await Task.update({ title: title, status: status, createdAt: createdAt }, { where: { id: id } });
    if (results === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function getChartData(req, res) {
  try {
    const { days } = req.query;
    
    let whereClause = {};

    if (days && days !== 'all') {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      
      whereClause = {
        createdAt: {
          [Op.gte]: startDate
        }
      };
    }

    const tasks = await Task.findAll({
      where: whereClause, 
      attributes: [
        [fn('DATE', col('createdAt')), 'date'], 
        'status',
        [fn('COUNT', col('id')), 'count'],    
      ],
      group: [fn('DATE', col('createdAt')), 'status'],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
    });

    const formattedData = tasks.reduce((acc, curr) => {
      const date = curr.get('date');
      const status = curr.status || 'todo'; 
      const count = parseInt(curr.get('count'));

      let dayEntry = acc.find(item => item.date === date);

      if (!dayEntry) {
        dayEntry = { date, toDo: 0, doing: 0, done: 0 };
        acc.push(dayEntry);
      }

      if (status === 'completed' || status === 'done') dayEntry.done += count;
      else if (status === 'doing' || status === 'in_progress') dayEntry.doing += count;
      else dayEntry.toDo += count;

      return acc;
    }, []);

    return res.status(200).json(formattedData);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching chart data", error: error.message });
  }
}

export async function deleteTask(req, res, next) {
  const { id } = req.params;
  try {
    const results = await Task.destroy({ where: { id: id } });
    if (results === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}
