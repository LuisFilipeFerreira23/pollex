export function initialTesting(req, res, next) {
  res.status(200).json({ message: "Login route is working!" });
}
export function login(req, res) {
  res.send("123");
}

export function register(req, res) {
  console.log(123);
}

export function passwordRecovery(req, res) {
  console.log(123);
}