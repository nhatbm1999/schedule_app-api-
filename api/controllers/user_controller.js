const User = require("../models/user_model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var refreshTokens = {};
const _CONF = require("../config/");

exports.getUserInfo = (req, res, next) => {
  const userId = req.query.id;
  User.findById(userId).exec().then(data => {
    console.log(data);
    if(data != null) {
      res.status(200).json({
        data: data
      });
    } else {
      res.status(500).json({
        message: "Get User Info error",
        error: "Can't find user"
      });
    }
    
  }).catch((error) => {
    console.log(error);
      res.status(500).json({
        message: "Get failed!",
        error: error,
      });
  }) 
}

exports.registerEvent = (req, res, next) => {
  const _id = req.body._id;
  const event_name = req.body.event_name;
  const event_description = req.body.event_description;
  const event_image = req.body.event_image;
  const start_time = req.body.start_time;
  const end_time = req.body.end_time;
  const is_all_day = req.body.is_all_day;
  const userId = req.query.id;
  const eventList = {
    _id : _id,
    event_name : event_name,
    event_description: event_description,
    event_image: event_image,
    start_time: start_time,
    end_time: end_time,
    is_all_day: is_all_day,
  }

  User.findOneAndUpdate(
    { _id: userId },
    { $push: { registeredEvents: eventList } }
  )
    .exec()
    .then((result) => {
      console.log(result);
      if (result != null) {
        res.status(200).json({
          message: "Register Event Success!",
          register_event: _id,
        });
      } else {
        res.status(500).json({
          message: "Register event failed!",
          error: "Can't find event"
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Register event failed!",
        error: err,
      });
    });
};

exports.unregisterEvent = (req, res, next) => {
  const _id = req.body._id;
  const userId = req.query.id;
  const eventList = {
    _id : _id,
  }

  User.findOneAndUpdate(
    { _id: userId },
    { $pull: { registeredEvents: eventList } }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Unregistered Event Success!",
        unregister_event: _id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Unregister event failed!",
        error: err,
      });
    });
};

exports.Update = (req, res, next) => {
  const userId = req.query.id;
  User.findByIdAndUpdate(userId, {$set: req.body}, {new: true}).then(result => {
    console.log(result);
    res.status(200).json({
      success: 1,
      message: 'Update Successful!'
    })
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      success: 0,
      error: err
    })
  })
}

exports.Register = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          success: 0,
          message: "Email is already existed!",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              success: 0,
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              email: req.body.email,
              password: hash,
              phone: req.body.phone,
              avatar: req.body.avatar,
              role: "user",
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(200).json({
                  success: 1,
                  message: "User created!",
                  _id: new mongoose.Types.ObjectId(),
                  email: req.body.email,
                  phone: req.body.phone,
                  username: req.body.username,
                  avatar: "",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.Login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          success: 0,
          message: "Login Failed!",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            success: 0,
            message: "Login Failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
              role: user[0].role,
            },
            "secret",
            {
              expiresIn: _CONF.tokenLife,
            }
          );
          return res.status(200).json({
            access_token: token,
            expire_in: _CONF.tokenLife,
          });
        }
      });
    });
};

exports.Refresh = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    let token = req.headers.authorization.split("Bearer ")[1];
    let data = jwt.verify(token, process.env.JWT_KEY);
    try {
      const token = jwt.sign(
        {
          email: data.email,
          userId: data._id,
          role: data.role,
        },
        process.env.JWT_KEY,
        {
          expiresIn: _CONF.tokenLife,
        }
      );
      return res.status(200).json({
        access_token: token,
        expire_in: _CONF.tokenLife,
      });
    } catch (error) {
      return res.status(403).json({
        success: 0,
        message: "Token expired or Unauthorized Status Code",
        details: error.toString(),
      });
    }
  }
};
