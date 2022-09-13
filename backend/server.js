const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();

app.use("/api/places", placesRoutes);

app.use((error, req, res, next) => {
  // check if the response has already been sent
  if (res.headerSent) {
    return next(error);
  }

  console.log(res);

  res.status(error.code || 500);
  res.json({ message: error.message || "An unkown error occured" });
}); // will execute if the above middlewares have an error

app.listen(4000);
