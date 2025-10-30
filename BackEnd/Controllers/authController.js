export function initialTesting(req, res, next) {
  res.status(200).json({ message: "Login route is working!" });
}
export function login() {
  console.log(123);
}
export function register() {
  console.log(123);
}
export function passwordRecovery() {
  console.log(123);
}
