const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.send(`<html><body>
  <a href="/urls">link text</a>
  </body></hmtl>`);
});



app.get("/urls", (req, res) => {

  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/updatedLong", (request, response) => {
  urlDatabase[request.params.shortURL] = request.body.updatedLong;
  response.redirect('/urls');
})
app.post("/urls", (request, res) => {
  const key = generateRandomString();
  urlDatabase[key] = request.body.longURL;
  res.redirect("urls");       // Respond with 'Ok' (we will replace this)
});
app.post("/login", (request, response) => {
  response.cookie('username', request.body.username);
  response.redirect('/urls');
});

app.post("/logout", (request, response) => {
  response.clearCookie("username");
  response.redirect('/urls');
});

app.post("/urls/:shortURL/delete", (request, response) => {
  delete urlDatabase[request.params.shortURL];
  response.redirect('/urls');
})

//USING href instead
// app.post("/urls/:shortURL/edit", (request, response) => {
//   response.redirect('/urls/' + [request.params.shortURL]);
// })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//generate a random string with 6 characters containing [z-Z,a-A].
function generateRandomString() {
  randomString = '';
  const A = 97;
  const Z = 122;
  const STRINGLENGTH = 6;
  let capitalOrNot = 0;
  let random = 0;

  for (let i = 0; i < STRINGLENGTH; i++) {
    capitalOrNot = (Math.random() >= 0.5) ? 32 : 0;
    random = Math.floor(Math.random() * (Z - A)) + A;
    randomString += String.fromCharCode(random - capitalOrNot);
  }
  return randomString;
}