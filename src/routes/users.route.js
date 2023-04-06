const { handleError } = require("../helpers/http-error-helper");
const {
  getUsers,
  getUserById,
  deleteUserByID,
  createUser,
} = require("../services/users.service");
const router = require("express").Router();

router.get("/", (req, res) => {
  try {
    const roleFilter = req.query.role;
    const users = getUsers(roleFilter);
    return res.status(200).send(users);
  } catch (err) {
    handleError(err, res);
  }
});

router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;
    const user = getUserById(id);
    return res.status(200).send(user);
  } catch (err) {
    handleError(err, res);
  }
});

router.post("/", (req, res) => {
  try {
    const newUser = req.body;
    const response = createUser(newUser);
    return res.status(201).send(response);
  } catch (err) {
    handleError(err, res);
  }
});

router.delete("/:id", (req, res) => {
  try {
    const id = req.params.id;
    deleteUserByID(id);
    return res.status(202).send("User deleted");
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
