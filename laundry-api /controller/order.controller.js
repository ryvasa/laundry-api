const Order = require("../models").Order;
const User = require("../models").User;
const Status = require("../models").Status;

exports.addOrder = async (req, res) => {
  try {
    const { weight } = req.body;
    const price = weight * 8000;
    const userId = req.userId;
    const order = await Order.create({ weight, price, user_id: userId });
    res.status(201).send({ status: "Created", error: null, data: order });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
exports.findAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["id", "email", "name"] },
        { model: Status, attributes: ["id", "status", "details"] },
      ],
    });
    res.status(200).send({ status: "OK", error: null, data: orders });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};

exports.findOneOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      where: { id },
      include: [
        { model: User, attributes: ["id", "email", "name"] },
        { model: Status, attributes: ["id", "status", "details"] },
      ],
    });
    if (!order) {
      return res.status(404).send({
        status: "Error",
        message: `Order with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    res.status(200).send({ status: "OK", error: null, data: order });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
exports.findAllOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.userId },
      include: [
        { model: User, attributes: ["id", "email", "name"] },
        { model: Status, attributes: ["id", "status", "details"] },
      ],
    });
    res.status(200).send({ status: "OK", error: null, data: orders });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { weight } = req.body;
    const price = weight * 8000;
    const order = await Order.findOne({
      where: { id },
      include: [
        { model: User, attributes: ["id", "email", "name"] },
        { model: Status, attributes: ["id", "status", "details"] },
      ],
    });
    if (!order) {
      return res.status(404).send({
        status: "Error",
        message: `Order with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    order.set({
      weight: weight || order.weight,
      price: price || order.price,
    });
    await order.save();
    res.status(200).send({ status: "OK", error: null, data: order });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ where: { id } });
    if (!order) {
      return res.status(404).send({
        status: "Error",
        message: `Status with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    await Order.destroy({ where: { id } });
    res
      .status(200)
      .send({ status: "OK", error: null, data: "Order has been deleted" });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};

exports.updateStatusOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findOne({
      where: { id },
    });
    if (!order) {
      return res.status(404).send({
        status: "Error",
        message: `Order with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    order.set({
      status: status || order.status,
    });
    await order.save();
    const response = await Order.findOne({
      where: { id },
      include: [
        { model: User, attributes: ["id", "email", "name"] },
        { model: Status, attributes: ["id", "status", "details"] },
      ],
    });
    res.status(200).send({ status: "OK", error: null, data: response });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
