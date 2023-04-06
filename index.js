const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

// Routes import
const usersRoute = require("./src/routes/users.route");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/users", usersRoute);

app.listen(3000, () => {
  console.log("Server started");
});
