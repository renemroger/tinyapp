const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/urls", (req, res) => {
  const key = generateRandomString();
  const value = Object.values(req.body);
  urlDatabase[key] = value[0];

  console.log(req.body);  // Log the POST request body to the console
  res.send(urlDatabase);         // Respond with 'Ok' (we will replace this)
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});


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

