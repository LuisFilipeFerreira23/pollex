/* CRUDS */
import { client } from "../main.js";
export function getDashboard(request, response, next) {
  client.query("SELECT * FROM public.tickets", (error, results) => {
    if (error) {
      throw error;
    }

    if (!response) {
      console.log("Error!!!");
    }
    response.status(200).json(results);
  });
}

export function deleteDashboard(request, response, next) {
  client.query("DELETE FROM public.tickets WHERE id = 2", (error, results) => {
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
