const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./models");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const statusRoute = require("./routes/status.route");
const orderRoute = require("./routes/order.route");
const transactionRoute = require("./routes/transaction.route");

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:5173"],
  })
);
app.use(cookieParser());
app.use(authRoute);
app.use(userRoute);
app.use(statusRoute);
app.use(orderRoute);
app.use(transactionRoute);

db.sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
