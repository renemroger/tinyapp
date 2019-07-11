const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080; // default port 8080
const cookieSession = require('cookie-session');
const generateRandomString = require('./utils/utils');
const { users } = require('./users');
const { validateEmail, validatePassword } = require('./validations');
const urlDatabase = require('./data');
const bcrypt = require('bcrypt');


app.set('trust proxy', 1)
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
app.set('trust proxy', 1)


app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))



app.get("/", (request, response) => {

  request.session.views = (req.session.views || 0) + 1
  response.send(`<html><body>
  <a href="/urls">link text</a>
  </body></hmtl>`);
});

app.get("/urls", (request, response) => {
  const user_id = request.session['user_id'];
  let templateVars = {
    urls: urlDatabase,
    user: getUserById(user_id)
  };
  response.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  const longURL = urlDatabase[request.params.shortURL].longURL;
  response.redirect(longURL);
});

app.get("/login", (request, response) => {

  const user_id = request.session.user_id || '';
  let templateVars = { user: getUserById(user_id) }
  response.render('login', templateVars)
});


app.get("/urls/new", (request, response) => {
  const user_id = request.session['user_id'];
  let templateVars = { user: getUserById(user_id) };
  response.render("urls_new", templateVars);
});

app.get("/registration", (request, response) => {
  const user_id = request.session['user_id'];
  let templateVars = { user: getUserById(user_id) };
  response.render("registration", templateVars);
});

app.get("/urls/:shortURL", (request, response) => {
  const user_id = request.session['user_id'];
  let templateVars = { user: getUserById(user_id), shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL].longURL };
  response.render("urls_show", templateVars);
});

app.post("/urls", (request, response) => {
  const key = generateRandomString();
  //IF USER IS LOGGED IN
  urlDatabase[key] = {
    longURL: request.body.longURL,
    userID: request.session['user_id']
  }
  response.redirect("urls");       // responsepond with 'Ok' (we will replace this)
});
app.post("/login", (request, response) => {

  const userEmail = request.body.email;
  const userPassword = request.body.password;

  for (const key in users) {
    if (users[key].email === userEmail &&
      bcrypt.compareSync(userPassword, users[key].password)) {
      request.session.user_id = users[key].id;
      response.redirect('/urls');
      return;
    }
  }
  response.status(403).send("Server Error: 403");
});

app.post("/logout", (request, response) => {
  request.session = null
  response.redirect('/urls');
});

app.post("/urls/:shortURL/updatedLong", (request, response) => {
  //updating longURL  
  urlDatabase[request.params.shortURL].longURL = request.body.updatedLong;
  response.redirect('/urls');
})

app.post("/urls/:shortURL/delete", (request, response) => {
  if (urlDatabase[request.params.shortURL].userID === request.session['user_id']) {
    delete urlDatabase[request.params.shortURL];
  }
  response.redirect('/urls');
})

app.post("/registration", validatePassword, validateEmail, (request, response) => {
  const randId = generateRandomString();
  const user = {
    id: randId,
    email: request.body.email,
    password: bcrypt.hashSync(request.body.password, 10)
  }
  request.session.user_id = randId;
  users[randId] = user;
  response.redirect('/urls');
})

app.use((error, request, response, next) => {
  const user_id = request.session['user_id'];
  let templateVars = { user: getUserById(user_id), error: error.error };
  if (error && error.statusCode) {
    response
      .status(error.statusCode())
      .render("error", templateVars);
  } else {
    response.status(500).send("Server Error: " + error);
  }
});

const getUserById = function(cookie) {
  return userForHeader = users[cookie];
}

const getIdByEmail = function(email, database) {

  for (const user in database) {
    if (database[user].email === email) {
      return database[user].id;
    }
  }
  return '';
}


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

