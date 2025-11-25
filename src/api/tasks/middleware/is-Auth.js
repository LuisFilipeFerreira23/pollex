export function isAuth(req, res, next) {
  if (!request.session.isLoggedIn) {
    return console.error("Not logged in idot!");
  }
}
