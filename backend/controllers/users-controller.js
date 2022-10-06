const User = require("../models/user");
const bcrypt = require("bcryptjs");
const HttpError = require("../models/http-error");

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // validate credentials
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Failed to login. Please try again later!", 500));
  }

  if (!existingUser) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        401
      )
    );
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HttpError("Could not log you in, please check your credentials!", 500)
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        401
      )
    );
  }

  res.status(201).json({ user: existingUser.toObject({ getters: true }) });
};

const createUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  // validate credentials
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Failed to signup.", 500));
  }

  if (existingUser) {
    return next(new HttpError("This email address already in use", 422));
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HttpError("Could not create user, please try again later!", 500)
    );
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later!", 500)
    );
  }

  // login user

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const getAllUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(
      new HttpError("Something went wrong. Please try again later.", 500)
    );
  }

  res.json(users.map((user) => user.toObject({ getters: true })));
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
};
