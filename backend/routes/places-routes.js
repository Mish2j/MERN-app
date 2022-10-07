const express = require("express");
const router = express.Router();

const placesControllers = require("../controllers/places-cotroller");
const fileUpload = require("../middleware/file-upload");
const auth = require("../middleware/auth");

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.use(auth); // A middleware that checks if the user is authenticated (if the user is not authenticated, middlewares below will not be executed)
// middlewares below need the token (auth token) to execute

router.post("/", fileUpload.single("image"), placesControllers.createPlace);

router.patch("/:pid", placesControllers.updatePlaceById);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
