const jwt = require("jsonwebtoken");
const User = require("../models").User;

exports.verifyToken = async (req, res, next) => {
  try {
    jwt.verify(
      req.cookies.token,
      process.env.SECRETE,
      async (error, decoded) => {
        if (error) {
          return res.status(403).send({
            status: "Error",
            message: "Invalid refresh token",
            error: error.message,
            data: null,
          });
        }
        const user = await User.findOne({
          where: { id: decoded.id },
        });
        if (!user) {
          return res.status(404).send({
            status: "Error",
            message: `User not found from cookie`,
            error: "Not Found",
            data: null,
          });
        }
        req.userId = decoded.id;
        next();
      }
    );
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
