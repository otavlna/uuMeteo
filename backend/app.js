const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: process.env.FE_URL })); // Enable CORS for all routes

// use JSONs
app.use(express.json());

// for url encoded content type
app.use(express.urlencoded({ extended: true }));

// Session support for passport.js
var session = require("express-session");
var SQLiteStore = require("connect-sqlite3")(session);
var passport = require("passport");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./" }),
  })
);
app.use(passport.authenticate("session"));

app.use("/devices", require("./src/controllers/device.controller"));
app.use("/temperatures", require("./src/controllers/temperature.controller"));
app.use("/me", require("./src/controllers/me.controller"));
app.use("/", require("./src/controllers/auth.controller"));

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
