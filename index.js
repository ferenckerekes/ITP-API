const { json } = require("express");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const USERS = require("./users");
const users = USERS;
const { v4: uuidv4 } = require("uuid");
const existingRoles = ["Admin", "Manager", "Tester", "Client"];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.send(users);
});

app.get("/:id", function (req, res) {
  const id = req.params.id;
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
  const id = uuidv4();
  users.push({ ...newUser, id });
  return res.send({ ...newUser, id });
});

app.get("/filtered/:role", function (req, res) {
  const role = req.params.role.toLowerCase();
  if (!existingRoles.map((role) => role.toLowerCase()).includes(role)) {
    return res.status(400).send("Invalid role");
  }
  const filteredUsers = users.filter((u) => u.role.toLowerCase() === role);
  if (filteredUsers.length === 0) {
    return res.status(404).send(`No users with role: "${role}".`);
  }
  res.send(filteredUsers);
});

app.delete("/:id", function (req, res) {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  const targetIndex = users.findIndex((u) => u.id === user.id);
  users.splice(targetIndex, 1);
  return res.status(202).send("User deleted");
});

app.put("/:id", function (req, res) {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).send("User not found!");
  }
  const userCreatedYear = user.createdAt.slice(0, 4);
  user.message = `You registered in ${userCreatedYear}!`;
  res.send(user);
});

app.patch("/:id", function (req, res) {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).send("User not found!");
  }
  user.firstName = user.firstName.toUpperCase();
  res.send(user);
});

app.listen(3000, () => {
  console.log("Server started");
});
