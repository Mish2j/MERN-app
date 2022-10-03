const express = require("express");

const router = express.Router();

const fileUpload = require("../middlware/file-upload");

const {
  createUser,
  loginUser,
  getAllUsers,
} = require("../controllers/users-controller");

router.get("/", getAllUsers);

router.post("/signup", fileUpload.single("image"), createUser);

router.post("/login", loginUser);

module.exports = router;
