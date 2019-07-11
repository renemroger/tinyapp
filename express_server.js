const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const generateRandomString = require('./utils/utils');
const { users } = require('./users');
const { validateEmail, validatePassword } = require('./validations');


app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (request, response) => {
  response.send(`<html><body>
  <a href="/urls">link text</a>
  </body></hmtl>`);
});

app.get("/urls", (request, response) => {
  const user_id = request.cookies["user_id"];
  let templateVars = {
    urls: urlDatabase,
    user: getUserById(user_id)
  };
  response.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  const user_id = request.cookies["user_id"];
  let templateVars = {
    urls: urlDatabase,
    user: getUserById(user_id)
  };
  // const longURL = ...
  const longURL = urlDatabase[request.params.shortURL];
  response.redirect(longURL, templateVars);
});

app.get("/login", (request, response) => {

  const user_id = request.cookies["user_id"];
  let templateVars = { user: getUserById(user_id) }
  response.render('login', templateVars)
});


app.get("/urls/new", (request, response) => {
  const user_id = request.cookies["user_id"];
  let templateVars = { user: getUserById(user_id) };
  response.render("urls_new", templateVars);
});

app.get("/registration", (request, response) => {
  const user_id = request.cookies["user_id"];
  let templateVars = { user: getUserById(user_id) };
  response.render("registration", templateVars);
});

app.get("/urls/:shortURL", (request, response) => {
  const user_id = request.cookies["user_id"];
  let templateVars = { user: getUserById(user_id), shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL] };
  response.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/updatedLong", (request, response) => {
  urlDatabase[request.params.shortURL] = request.body.updatedLong;
  response.redirect('/urls');
})
app.post("/urls", (request, response) => {
  const key = generateRandomString();
  urlDatabase[key] = request.body.longURL;
  response.redirect("urls");       // responsepond with 'Ok' (we will replace this)
});
app.post("/login", (request, response) => {
  let flag = false;
  console.log(users);
  for (const key in users) {
    console.log(users[key].email)
    if (users[key].email === request.body.email &&
      users[key].password === request.body.password) {
      console.log('found you');
      flag = true;
      response.cookie('user_id', users[key].id);
      response.redirect('/urls');
    }
  }
  if (!flag) {
    response.status(403).send("Server Error: 403");
  }
});

app.post("/logout", (request, response) => {
  response.clearCookie("user_id");
  response.redirect('/urls');
});

app.post("/urls/:shortURL/delete", (request, response) => {
  delete urlDatabase[request.params.shortURL];
  response.redirect('/urls');
})

app.post("/registration", validatePassword, validateEmail, (request, response) => {
  const randId = generateRandomString();
  const user = {
    id: randId,
    email: request.body.email,
    password: request.body.password
  }
  //response.cookie('user_id', randId);
  users[randId] = user;
  response.redirect('/urls');
})

app.use((error, request, response, next) => {
  const user_id = request.cookies["user_id"];
  let templateVars = { user: getUserById(user_id), error: error.error };
  if (error && error.statusCode) {
    response
      .status(error.statusCode())
      .render("error", templateVars);
  } else {
    response.status(500).send("Server Error: " + error);
  }
});

function getUserById(cookie) {
  return userForHeader = users[cookie];

}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

