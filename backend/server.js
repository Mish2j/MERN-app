const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-COntrol-Allow-Methods",
    "GET",
    "POST",
    "PATCH",
    "DELETE"
  );

  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// custom error for unsupported routes (404)
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// error handler
app.use((error, req, res, next) => {
  // check if the response has already been sent
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
}); // will execute if the above middlewares have an error

mongoose
  .connect(
    "mongodb+srv://Mish:Mishel2jzgte@cluster0.jv2fj2e.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(4000);
  })
  .catch((error) => {
    console.log(error);
  }); // connect mongoose to backend and server
