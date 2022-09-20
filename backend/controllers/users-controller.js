const { v4: uuidv4 } = require("uuid");

const USERS = [
  {
    id: "u1",
    name: "Max Schwarz",
    email: "test@test.com",
    password: "testers",
  },
];

const HttpError = require("../models/http-error");

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  const loggingUser = USERS.find((user) => user.email === email);

  if (!loggingUser || loggingUser.password !== password) {
    throw new HttpError(
      "Could not identify user, credentials seem to be wrong.",
      401
    );
  }

  res.json({ user: loggingUser });
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  const existingUser = USERS.find((u) => u.email === email);

  if (existingUser) {
    throw new HttpError("This email already in use.", 422);
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  // validate, throw error

  USERS.push(newUser);

  // login user

  res.status(201).json({ newUser });
};

const getAllUsers = (req, res, next) => {
  res.status(200).json(USERS);
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
};
