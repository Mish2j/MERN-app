const { default: mongoose } = require("mongoose");

const fs = require("fs");
const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find a place!", 500)
    );
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (error) {
    return next(
      new HttpError("Fetching places failed, please try again later!", 500)
    );
  }

  if (!userWithPlaces || userWithPlaces.length === 0) {
    return next(
      new Error("Could not find places for the provided user id.", 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;

  // coordinates must be generated from any/or google MAP API based on the provided address
  // In this function coordinates (location: lat, lng) are always the same for every created place

  // ADD VALIDATION
  const createdPlace = new Place({
    title,
    description,
    address,
    location: {
      lat: 124.2345,
      lng: -45.4534,
    },
    image: req.file.path,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again", 500));
  }

  if (!user) {
    return next(new HttpError("Couldn't find user!", 404));
  }

  try {
    const sess = await mongoose.startSession(); // current session - starts when we create new place
    sess.startTransaction(); // we start a transaction in our current session
    await createdPlace.save({ session: sess }); // saves data in DB and creates a unique place id automatically

    // we have to add this place id to the current user to make the connection between user and place
    user.places.push(createdPlace); // push - mongoose provided method which will take created place id and push it to the user places array

    await user.save({ session: sess });
    await sess.commitTransaction(); // the transaction will succeed only if this method executes successfully. If something goes wrong all changes will rolled back automatically
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again", 500));
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const { title, description } = req.body;

  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Request failed, please try again", 500));
  }

  // Additional check on the backend for security reasons.
  // Checks if the current user is the creator of this place (data)
  // Other users can't update the place data
  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit this place", 401));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(new HttpError("Failed to update data, please try again", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    return next(
      new HttpError("Failed to delete, please try again later!", 500)
    );
  }

  if (!place) {
    return next(new HttpError("Couldn't find a place for this id!", 404));
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place); // pull will automatically remove the place id from user.places array
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(
      new HttpError("Failed to delete, please try again later!", 500)
    );
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
