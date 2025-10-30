export function initialTesting(req, res, next) {
  res.status(200).json({ message: "Users route is working!" });
}
export function viewUserInfo() {
  console.log(123);
}
export function viewUserTasks() {
  console.log(123);
}
