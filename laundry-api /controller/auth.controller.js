const bcrypt = require("bcrypt");
const User = require("../models").User;
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        message: "Data must containt name, email and password",
        error: "Invalid Data",
      });
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });
    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    res.status(201).send({ status: "Created", error: null, data: response });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        status: "Error",
        message: "Data must containt email and password",
        error: "Invalid Data",
        data: null,
      });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({
        status: "Error",
        message: `User with email ${email} not found`,
        error: "Not Found",
        data: null,
      });
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(400).send({
        status: "Error",
        message: `Wrong password`,
        error: "Bad request",
        data: null,
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.SECRETE, {
      expiresIn: "1d",
    });
    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    };
    res
      .cookie("token", token, {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000,
        // secure:true
      })
      .status(200)
      .send({ status: "OK", error: null, data: response });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
