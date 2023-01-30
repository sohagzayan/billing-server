const express = require("express");
const cors = require("cors");
const app = express();
const errorHandlerGard = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: "backend/config/config.env" });

/* user external middleware */
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

/* Route import */
const user = require("./routes/userRoute");
const billing = require("./routes/billingRoute");
const helloWorld = require("./routes/helloWorldRoute");

app.use("/api", user);
app.use("/api", billing);
app.use("/", helloWorld);

// // send build folder
// app.use(express.static(path.join(__dirname, "../frontend/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

// middleware  error handler
app.use(errorHandlerGard);
module.exports = app;
