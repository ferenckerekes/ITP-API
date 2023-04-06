const USERS = require("../../data/users.data");
const {
  throwNotFoundError,
  throwBadRequestError,
} = require("../helpers/http-error-helper");
const { getUserDTO } = require("../helpers/user-helper");
const { v4: uuidv4 } = require("uuid");

const users = USERS;
const ROLES = ["Admin", "Manager", "Tester", "Client"];

const assertRole = (role) => {
  const validRoles = ROLES.map((role) => role.toLowerCase());

  if (role && !validRoles.includes(role.toLowerCase())) {
    throwBadRequestError("Invalid role.");
  }
};

const getUsers = (roleFilter) => {
  assertRole(roleFilter);

  let usersResponse = [...users];

  if (roleFilter) {
    usersResponse = usersResponse.filter(
      (u) => u.role.toLowerCase() === roleFilter.toLowerCase()
    );
  }

  if (!usersResponse.length) {
    throwNotFoundError("Users not found.");
  }

  return usersResponse.map(getUserDTO);
};

const getUserById = (id) => {
  const user = users.find((u) => u.id === id);

  if (!user) {
    throwNotFoundError("Users not found.");
  }

  return getUserDTO(user);
};

const assertEamilRegistered = (email) => {
  const user = users.find((u) => u.email === email);

  if (user) {
    throwBadRequestError("Email Already in use.");
  }
};

const createUser = (user) => {
  assertEamilRegistered(user.email);
  const id = uuidv4();
  const newUser = { ...user, id };
  users.push(newUser);
  return getUserDTO(newUser);
};

const deleteUserByID = (id) => {
  const user = getUserById(id);
  const targetIndex = users.findIndex((u) => u.id === user.id);
  users.splice(targetIndex, 1);
};

module.exports = { getUsers, getUserById, deleteUserByID, createUser };
