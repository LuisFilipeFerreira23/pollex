/* CRUD PARA TAREFAS */
import { client } from "../main.js";
export function getTasks(req, res, next) {
  client.query("SELECT * FROM public.task LIMIT 500", (error, results) => {
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
  client.query("SELECT * FROM public.task LIMIT 500", (error, results) => {
    if (error) {
      throw error;
    }

    if (!res) {
      console.log("Error!!!");
    }
    res.status(200).json(results.rows);
  });
}

export function updateTask(req, res, next) {
  const { id } = req.params;
  client.query(
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
        client.query(
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
  client.query(
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
