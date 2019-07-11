const { Error400 } = require("./errors");
const { users } = require('./users');

function validatePassword(request, response, next) {
  const { password } = request.body;
  if (!password) {
    return next(new Error400());
  }
  next();
}

function validateEmail(request, response, next) {
  const newEmail = request.body.email;
  Object.keys(users).forEach(user => {
    console.log('user.email: ', users[user].email, 'newEmail: ', newEmail);
    if (users[user].email === newEmail) {
      return next(new Error400());
    }
  });
  if (!newEmail) {
    return next(new Error400());
  }
  next();
}

module.exports = { validateEmail, validatePassword }