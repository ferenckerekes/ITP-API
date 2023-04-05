const { json } = require("express");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const USERS = require("./users");
const users = USERS;
const { v4: uuidv4 } = require("uuid");
const existingRoles = ["Admin", "Manager", "Tester", "Client"];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const getUserDTO = (user) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    country: user.country,
    createdAt: user.createdAt,
    phoneNumber: user.phoneNumber,
  };
};

app.get("/", function (req, res) {
  const roleFilter = req.query.role;
  if (roleFilter) {
    console.log("Role filter: " + roleFilter);
    if (!existingRoles.map((role) => role.toLowerCase()).includes(roleFilter)) {
      return res.status(400).send("Invalid role");
    }
    const filteredUsers = users.filter(
      (u) => u.role.toLowerCase() === roleFilter
    );
    if (filteredUsers.length === 0) {
      return res.status(404).send(`No users with role: "${roleFilter}".`);
    }
    console.log(filteredUsers);
    return res.send(filteredUsers.map(getUserDTO));
  }

  // const usersResponse = users.map((user) => getUserDTO(user));
  const usersResponse = users.map(getUserDTO);
  return res.send(usersResponse);
});

app.get("/:id", function (req, res) {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  return res.send(getUserDTO(user));
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
  return res.send(getUserDTO({ ...newUser, id }));
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
  const filteredUsersDTO = filteredUsers.map(getUserDTO);
  return res.send(filteredUsersDTO);
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
  const user = JSON.parse(JSON.stringify(users.find((u) => u.id === id)));
  if (!user) {
    return res.status(404).send("User not found!");
  }
  const userCreatedYear = user.createdAt.slice(0, 4);
  const message = `You registered in ${userCreatedYear}!`;
  const userDTO = getUserDTO(user);
  return res.send({ ...userDTO, message });
});

app.patch("/:id", function (req, res) {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).send("User not found!");
  }
  user.firstName = user.firstName.toUpperCase();
  return res.send(user);
});

app.listen(3000, () => {
  console.log("Server started");
});
