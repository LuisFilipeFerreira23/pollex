/* CRUDS */
import db from "../dbmanager";

export function getDashboard(request, response, next) {
  response.status(200).json("Dashboard route is working!");
}

export function deleteDashboard(request, response, next) {
  db.pool.query("DELETE FROM public.tickets WHERE id = 2", (error, results) => {
    if (error) {
      throw error;
    }

    if (!response) {
      console.log("Error!!!");
    }
    response.status(200);
  });

  response.json({
    info: "Hello world!",
  });
}
