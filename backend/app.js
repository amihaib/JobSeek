const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const jobRouter = require("./routes/jobRouter");
const employerRouter = require("./routes/employerRouter");
const globalErrorHandler = require("./utils/errorHandler");
const uploadCvRouter = require("./routes/uploadCvRouter");
const otpRouter = require("./routes/opt.Router");
// const OtpRouter = require("./routes/OtpRouter");
const path = require("path");

const AppError = require("./utils/AppError");

const origins = ["http://localhost:5173"];

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the request origin is in the allowedOrigins array, or if it's not set (e.g., when using Postman)
      if (origins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.static("public"));

app.use("/api/users", userRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/employer", employerRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/cv", uploadCvRouter);
app.use("/api/otp", otpRouter);
// app.use("/api/otp", OtpRouter);

app.all("*", (req, res, next) => {
  const err = new AppError(404, "the request route not exist");
  next(err);
});

app.use(globalErrorHandler);
module.exports = app;
