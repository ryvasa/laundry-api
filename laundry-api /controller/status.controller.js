const Status = require("../models").Status;

exports.addStatus = async (req, res) => {
  try {
    const { status, details } = req.body;
    const response = await Status.create({ status, details });
    res.status(201).send({ status: "Created", error: null, data: response });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
exports.findAllStatus = async (req, res) => {
  try {
    const statuses = await Status.findAll();
    res.status(200).send({ status: "OK", error: null, data: statuses });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};

exports.findOneStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await Status.findOne({ where: { id } });
    if (!status) {
      return res.status(404).send({
        status: "Error",
        message: `Status with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    res.status(200).send({ status: "OK", error: null, data: status });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, details } = req.body;
    const dataStatus = await Status.findOne({ where: { id } });
    if (!dataStatus) {
      return res.status(404).send({
        status: "Error",
        message: `Status with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    dataStatus.set({
      status: status || dataStatus.status,
      details: details || dataStatus.details,
    });
    await dataStatus.save();
    res.status(200).send({ status: "OK", error: null, data: dataStatus });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
exports.deleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await Status.findOne({ where: { id } });
    if (!status) {
      return res.status(404).send({
        status: "Error",
        message: `Status with id ${id} not found`,
        error: "Not Found",
        data: null,
      });
    }
    await Status.destroy({ where: { id } });
    res
      .status(200)
      .send({ status: "OK", error: null, data: "Status has been deleted" });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message, data: null });
  }
};
