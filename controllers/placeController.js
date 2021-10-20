const { Place } = require("../models");
const { distance } = require("../helpers/distance");

class PlaceController {
  static async getPlace(req, res, next) {
    const { latitude, longitude } = req.user;
    try {
      const places = await Place.findAll();
      let filteredPlace = await places.filter((place) => {
        if (distance(latitude, place.latitude, longitude, place.longitude) < 100) {
          return place;
        }
      });
      res.status(200).json(filteredPlace);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PlaceController