const express = require("express");
const router = express.Router();

const placesControllers = require("../controllers/places-cotroller");
const fileUpload = require("../middlware/file-upload");

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.post("/", fileUpload.single("image"), placesControllers.createPlace);

router.patch("/:pid", placesControllers.updatePlaceById);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
