const User = require("../models").User;

exports.addUser = async (req, res) => {
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
exports.findAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["id", "name", "email"] });
    res.status(200).send({ status: "OK", error: null, data: users });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
exports.findOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
      attributes: ["id", "name", "email"],
    });
    if (!user) {
      return res.status(404).send({
        status: "Error",
        message: `User with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    res.status(200).send({ status: "OK", error: null, data: user });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
exports.updateUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
      attributes: ["id", "name", "email"],
    });
    if (!user) {
      return res.status(404).send({
        status: "Error",
        message: `User with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    if (password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);
    } else {
      password = user.password;
    }
    user.set({
      name: name || user.name,
      email: email || user.email,
      password,
    });
    await user.save();
    res.status(200).send({ status: "OK", error: null, data: user });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).send({
        status: "Error",
        message: `User with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    await user.destroy({ where: { id } });
    res
      .status(200)
      .send({ status: "OK", error: null, data: `User has been deleted` });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
