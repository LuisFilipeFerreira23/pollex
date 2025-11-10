/* CRUD PARA TAREFAS */
import db from "../dbmanager.js";
const { Task } = db;

const checkError = (error, res, next) => {
  if (error) {
    next(error);
    return;
  }
  if (!res) {
    console.log("Error!!!");
  }
};

// Using Sequelize:
export async function getTasks(req, res, next) {
  try {
    const results = await Task.findAll({ limit: 10 });
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}

export function addTask(req, res, next) {
  //Json body definition and query
  const {
    space_id,
    title,
    status,
    priority,
    assigned_to,
    created_by,
    due_date,
    estimated_hours,
  } = req.body;
  const insertQuery = `INSERT INTO public.tasks (space_id, title, status, priority, assigned_to, created_by, due_date, estimated_hours) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`;
  const values = [
    space_id,
    title,
    status,
    priority || null,
    assigned_to || null,
    created_by,
    due_date || null,
    estimated_hours || null,
  ];

  db.pool.query(insertQuery, values, (error, results) => {
    checkError(error, res, next);
    res.status(201).json(results.rows[0]); // Return inserted task record
  });
}

export function updateTask(req, res, next) {
  const { id } = req.params;
  const allowed = [
    "space_id",
    "title",
    "status",
    "priority",
    "assigned_to",
    "created_by",
    "due_date",
    "estimated_hours",
  ];
  const updates = [];
  const values = [];

  // collect provided fields
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) {
      values.push(req.body[key]);
      updates.push(`${key} = $${values.length}`);
    }
  });

  // require at least one updatable field from the client
  if (values.length === 0) {
    return res.status(400).json({ message: "No updatable fields provided" });
  }

  // add updated_at
  values.push(new Date());
  updates.push(`updated_at = $${values.length}`);
  // add id param
  values.push(id);
  const query = `UPDATE public.tasks SET ${updates.join(
    ", "
  )} WHERE task_id = $${values.length} RETURNING *;`;

  db.pool.query(query, values, (error, results) => {
    checkError(error, res, next);
    if (!results.rows || results.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(results.rows[0]);
  });
}

export function deleteTask(req, res, next) {
  const { id } = req.params;
  db.pool.query(
    "DELETE FROM public.tasks WHERE task_id = $1",
    [id],
    (error, results) => {
      checkError(error, res, next);
      res.status(200).json({ message: "Task deleted successfully" });
    }
  );
}
