const Order = require("../models").Order;
const User = require("../models").User;
const Status = require("../models").Status;
const Transaction = require("../models").Transaction;

exports.addTransaction = async (req, res) => {
  try {
    const { order_id, payment_method } = req.body;
    const order = await Order.findOne({ where: { id: order_id } });
    if (!order) {
      return res.status(404).send({
        status: "Error",
        message: `Order with id ${order_id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    const transaction = await Transaction.create({ order_id, payment_method });
    order.set({
      status: 3,
    });
    order.save();
    res.status(201).send({ status: "Created", error: null, data: transaction });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
exports.findAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Order,
          attributes: ["id", "weight", "price", "status"],
          include: [
            { model: User, attributes: ["id", "email", "name"] },
            { model: Status, attributes: ["id", "status", "details"] },
          ],
        },
      ],
    });
    res.status(200).send({ status: "OK", error: null, data: transactions });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
exports.findOneTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      where: { id },
      include: [
        {
          model: Order,
          attributes: ["id", "weight", "price", "status"],
          include: [
            { model: User, attributes: ["id", "email", "name"] },
            { model: Status, attributes: ["id", "status", "details"] },
          ],
        },
      ],
    });
    if (!transaction) {
      return res.status(404).send({
        status: "Error",
        message: `Transaction with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    res.status(200).send({ status: "OK", error: null, data: transaction });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
exports.updateTransaction = async (req, res) => {
  try {
    const { order_id, payment_method } = req.body;
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      where: { id },
    });
    if (!transaction) {
      return res.status(404).send({
        status: "Error",
        message: `Transaction with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    transaction.set({
      order_id: order_id || transaction.order_id,
      payment_method: payment_method || transaction.payment_method,
    });
    await transaction.save();
    const response = await Transaction.findOne({
      where: { id },
      include: [
        {
          model: Order,
          attributes: ["id", "weight", "price", "status"],
          include: [
            { model: User, attributes: ["id", "email", "name"] },
            { model: Status, attributes: ["id", "status", "details"] },
          ],
        },
      ],
    });
    res.status(200).send({ status: "OK", error: null, data: response });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      where: { id },
    });
    if (!transaction) {
      return res.status(404).send({
        status: "Error",
        message: `Transaction with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    await Transaction.destroy({ where: { id } });
    res.status(200).send({
      status: "OK",
      error: null,
      data: "Transaction has been deleted",
    });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
