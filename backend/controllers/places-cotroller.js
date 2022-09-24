const { default: mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");

let PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 124.2345,
      lng: -45.4534,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

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

  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(
      new HttpError("Fetching places failed, please try again later!", 500)
    );
  }

  if (!places || places.length === 0) {
    return next(
      new Error("Could not find places for the provided user id.", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
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
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png",
    creator,
  });

  let user;

  try {
    const sess = await mongoose.startSession(); // current session - starts when we create new place
    sess.startTransaction(); // we start a transaction in our current session
    await createdPlace.save({ session: sess }); // saves data in DB and creates a unique place id automatically

    // we have to add this place id to the current user to make the connection between user and place
    user.places.push(createdPlace); // push - mongoose provided method which will take created place id and push it to the user places array

    await user.save({ session: sess });
    await sess.commitTransaction(); // the transaction will succeed only if this method executed successfully. If something goes wrong all changes will rolled back automatically
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again", 500));
  }

  if (!user) {
    return next(new HttpError("Couldn't find user!", 404));
  }

  try {
    await createdPlace.save();
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

    place.title = title;
    place.description = description;

    await place.save();
  } catch (error) {
    return next(new HttpError("Request failed, please try again", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);

    await place.remove();
  } catch (error) {
    return next(
      new HttpError("Failed to delete, please try again later!", 500)
    );
  }

  res.status(200).json({ message: "Deleted place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
