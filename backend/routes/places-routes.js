const express = require("express");
const router = express.Router();

const placesControllers = require("../controllers/places-cotroller");

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlaceByUserId);

router.post("/", placesControllers.createPlace);

router.patch("/:pid", placesControllers.updatePlaceById);

module.exports = router;
