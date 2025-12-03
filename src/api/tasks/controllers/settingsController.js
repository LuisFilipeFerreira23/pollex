export function getSettings(req, res, next) {
  return res.status(200).json({ message: "Get settings route is working!" });
}
export function editSettings(req, res, next) {
  return res.status(200).json({ message: "Edit settings route is working!" });
}
export function deleteSettings(req, res, next) {
  return res.status(200).json({ message: "Delete settings route is working!" });
}
