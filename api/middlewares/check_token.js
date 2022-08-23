const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

module.exports = {
  checkToken: async (req, res, next) => {
    console.log(req.headers.authorization);
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      let token = req.headers.authorization.split("Bearer ")[1];
      let data = jwt.verify(token, process.env.JWT_KEY);
      console.log(data);
      try {
        const user = await User.findOne({email: data.email});
        if (!user) {
          throw new Error()
        }
        req.user = user
        req.token = token
        next()
      } catch (error) {
        return res.status(403).json({
          success: 0,
          message: "Token expired or Unauthorized Status Code",
          details: error.toString(),
        });
      }
    }
  },
};
