const { users } = require('./users');

//practicing middleware - making sure password is not empty
function validatePassword(request, response, next) {
  const { password } = request.body;
  if (!password) {
    return next(new Error());
  }
  next();
}

//practicing middleware - checking if email already exists
function validateEmail(request, response, next) {
  const newEmail = request.body.email;
  Object.keys(users).forEach(user => {
    if (users[user].email === newEmail) {
      return next(new Error());
    }
  });
  if (!newEmail) {
    return next(new Error());
  }
  next();
}

module.exports = { validateEmail, validatePassword }