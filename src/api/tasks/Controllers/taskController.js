/* CRUD PARA TAREFAS */
import db from "../dbmanager.js";

export function getTasks(req, res, next) {
  db.pool.query("SELECT * FROM public.tasks LIMIT 500", (error, results) => {
    if (error) {
      throw error;
    }

    if (!res) {
      console.log("Error!!!");
    }
    res.status(200).json(results.rows);
  });
}

export function addTask(req, res, next) {
  const { space_id, title, status, priority, assigned_to, created_by, due_date, estimated_hours } = req.body;

  const insertQuery = `
    INSERT INTO public.tasks
      (space_id, title, status, priority, assigned_to, created_by, due_date, estimated_hours)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [ space_id, title, status, priority || null, assigned_to || null, created_by, due_date || null, estimated_hours || null ];
  
  db.pool.query(insertQuery, values, (error, results) => {
    if (error) {
      next(error); // Pass error to Express error handler middleware
      return;
    }
    res.status(201).json(results.rows[0]); // Return inserted task record
   });
}
    
// export function addTask(req, res, next) {
//   db.pool.query("SELECT * FROM public.tasks LIMIT 500", (error, results) => {
//     if (error) {
//       throw error;
//     }

//     if (!res) {
//       console.log("Error!!!");
//     }
//     res.status(200).json(results.rows);
//   });
// }

export function updateTask(req, res, next) {
  const { id } = req.params;
  db.pool.query(
    "SELECT * FROM public.task WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }

      if (results.rows.length === 0) {
        console.log("Error!!!");
      } else {
        const newDate = new Date();
        Pool.query(
          "UPDATE public.task SET updated_at = $1 WHERE id = $2",
          [newDate, id],
          (error, results) => {
            if (error) {
              throw error;
            }
            res.status(200).json({ message: "Task updated successfully" });
          }
        );
      }
      //res.status(200).json(results.rows);
    }
  );
}

export function deleteTask(req, res, next) {
  const { id } = req.params;
  db.pool.query(
    "DELETE FROM public.task WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }

      if (!res) {
        console.log("Error!!!");
      }

      res.status(200).json({ message: "Task deleted successfully" });
    }
  );
}