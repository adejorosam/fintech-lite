require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pug = require("pug");
const path = require("path");
const morgan = require("morgan");
const colors = require("colour");
const connectDB = require("./src/config/db");
const errorHandlerMiddleware = require("./src/middlewares/errorHandlerMiddleware");

const app = express();

app.use(express.urlencoded({ extended: false }));

//Body parser
app.use(express.json());

// Route files
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const paystackRoutes = require("./src//routes/paystack");

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "src/public/")));
app.set("views", path.join(__dirname, "src/views"));

app.set("view engine", "pug");

const PORT = process.env.PORT || 3000;

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/", paystackRoutes);

// Connect to mongo db
connectDB();

//Error handler middleware
app.use(errorHandlerMiddleware);

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

module.exports = app;
