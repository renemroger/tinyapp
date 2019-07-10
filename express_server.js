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
  const userForHeader = users[user_id];
  let templateVars = {
    urls: urlDatabase,
    user: userForHeader
  };
  console.log(templateVars);
  response.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  // const longURL = ...
  const longURL = urlDatabase[request.params.shortURL];
  response.redirect(longURL);
});


app.get("/urls/new", (request, response) => {
  const user_id = request.cookies["user_id"];
  const userForHeader = users[user_id];
  let templateVars = { user: userForHeader };
  response.render("urls_new", templateVars);
});

app.get("/registration", (request, response) => {
  const user_id = request.cookies["user_id"];
  const userForHeader = users[user_id];
  let templateVars = { user: userForHeader };
  response.render("registration", templateVars);
});

app.get("/urls/:shortURL", (request, response) => {
  const user_id = request.cookies["user_id"];
  const userForHeader = users[user_id];

  let templateVars = { user: userForHeader, shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL] };
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
  response.cookie('user_id', request.body.id);
  response.redirect('/urls');
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
  response.cookie('user_id', randId);
  users[randId] = user;
  response.redirect('/urls');
})

app.use((error, request, response, next) => {
  const user_id = request.cookies["user_id"];
  const userForHeader = users[user_id];
  let templateVars = { user: userForHeader, error: error.error };
  if (error && error.statusCode) {
    response
      .status(error.statusCode())
      .render("error", templateVars);
  } else {
    response.status(500).send("Server Error: " + error);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

