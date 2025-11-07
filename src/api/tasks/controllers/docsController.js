export function getDocs(req, res, next) {
  res.status(200).json({ message: "Docs route is working!" });
}
export function deleteDocs() {
  console.log("123");
}
