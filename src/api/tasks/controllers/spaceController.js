import db from "../dbmanager.js";

export function initialTesting(req, res, next) {
  db.pool.query("SELECT * FROM public.space LIMIT 500", (error, results) => {
    if (error) {
      throw error;
    }

    if (!res) {
      console.log("Error!!!");
    }
    res.status(200).json(results.rows);
  });
}

export function getSpace() {
  console.log(123);
}

export function getList() {
  console.log(123);
}

export function addSpace() {
  console.log(123);
}

export function editSpace() {
  console.log(123);
}

export function updateSpace() {
  console.log(123);
}

export function getKanban() {
  console.log(123);
}

export function addKanban() {
  console.log(123);
}

export function editKanban() {
  console.log(123);
}

export function updateKanban() {
  console.log(123);
}
