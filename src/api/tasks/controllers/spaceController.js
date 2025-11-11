import db from "../dbmanager.js";
const { Space } = db;

export function getSpace(req, res, next) {
  try {
    const results = Space.findAll({ limit: 10 });
    res.status(200).json(results);
  } catch (error) {
    next("Error fetching space: " + error.message);
  }
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
