const User = require("../models/user");

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

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        401
      )
    );
  }

  res.json({ message: "Login Success" });
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

  const newUser = new User({
    name,
    email,
    password,
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80",
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
