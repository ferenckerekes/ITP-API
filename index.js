const { json } = require("express");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const user1 = {
  username: "root",
  password: "secret",
  email: "abc@gmail.com",
  id: 1,
};
const user2 = {
  username: "feri",
  password: "rudi",
  email: "def@gmail.com",
  id: 2,
};
const users = [user1, user2];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  console.log("Hello ");
  res.send(users);
});

app.get("/:id", function (req, res) {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.send(user);
});

app.post("/", function (req, res) {
  const newUser = req.body;
  const email = newUser.email;
  const user = users.find((u) => u.email === email);
  if (user) {
    return res.status(400).send("Email already in use");
  }
  const id = users.length + 1;
  users.push({ ...newUser, id });
  return res.send(newUser);
});

app.listen(3000, () => {
  console.log("Server started");
});
