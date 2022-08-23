const Event = require("../models/event_model");
const mongoose = require("mongoose");

exports.Create = (req, res, next) => {
  const event = new Event({
    _id: new mongoose.Types.ObjectId(),
    event_name: req.body.event_name,
    event_description: req.body.event_description,
    event_image: req.body.event_image,
    event_location_longitude: req.body.event_location_longitude,
    event_location_latitude: req.body.event_location_latitude,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    is_all_day: req.body.is_all_day,
  });
  event
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        success: 1,
        message: "Event created!",
        _id: new mongoose.Types.ObjectId(),
        event_name: req.body.event_name,
        event_description: req.body.event_description,
        event_image: req.body.event_image,
        event_location_longitude: req.body.event_location_longitude,
        event_location_latitude: req.body.event_location_latitude,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        is_all_day: req.body.is_all_day,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.Read = (req, res, next) => {
  Event.find()
    .select(
      "event_name event_description event_image event_location_longitude event_location_latitude start_time end_time is_all_day"
    )
    .exec()
    .then((data) => {
      console.log(data);
      res.status(200).json({ data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Get event failed!",
        error: err,
      });
    });
};

exports.ReadEventByUserId = (req, res, next) => {
  const userId = req.query.id;
  Event.findById(userId)
    .select("event_name event_description start_time end_time is_all_day")
    .exec()
    .then((data) => {
      console.log(data);
      res.status(200).json({ data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Get event failed!",
        error: err,
      });
    });
};

exports.Delete = (req, res, next) => {
  const eventId = req.query.id;
  Event.findByIdAndRemove(eventId)
    .exec()
    .then((result) => {
      console.log(result);
      res.status(204).json({});
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: 0,
        error: err,
      });
    });
};
