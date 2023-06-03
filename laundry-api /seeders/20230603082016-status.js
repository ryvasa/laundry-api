"use strict";
// Membuat objek Date untuk tanggal dan waktu saat ini
var date = new Date();

// Mendapatkan nilai tahun, bulan, tanggal, jam, menit, dan detik dari objek Date
var year = date.getFullYear();
var month = ("0" + (date.getMonth() + 1)).slice(-2);
var day = ("0" + date.getDate()).slice(-2);
var hours = ("0" + date.getHours()).slice(-2);
var minutes = ("0" + date.getMinutes()).slice(-2);
var seconds = ("0" + date.getSeconds()).slice(-2);

// Membentuk string dengan format yang sama dengan DATETIME di MySQL
var datetime =
  year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const status_data = [
      {
        status: "Queued",
        details:
          "Pesanan telah diterima dan ditambahkan ke dalam antrian untuk diproses.",
        createdAt: datetime,
        updatedAt: datetime,
      },
      {
        status: "In Progress",
        details: "Pesanan sedang dalam proses pencucian atau perawatan.",
        createdAt: datetime,
        updatedAt: datetime,
      },
      {
        status: "Completed",
        details:
          "Pesanan telah selesai diproses dan siap untuk diambil atau dikirim ke pelanggan.",
        createdAt: datetime,
        updatedAt: datetime,
      },
      {
        status: "Pending Payment",
        details:
          "Pesanan telah selesai diproses, tetapi menunggu pembayaran dari pelanggan.",
        createdAt: datetime,
        updatedAt: datetime,
      },
      {
        status: "Cancelled",
        details:
          "Pesanan telah dibatalkan oleh pelanggan atau oleh pihak laundry.",
        createdAt: datetime,
        updatedAt: datetime,
      },
    ];

    await queryInterface.bulkInsert("Statuses", status_data);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Statuses", null, {});
  },
};
