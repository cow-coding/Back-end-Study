const bodyParser = require("body-parser");
const express = require("express");
const crypto = require("crypto");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("connect-flash");
const PORT = process.env.PORT || 3000;
var MongoDBStore = require("connect-mongodb-session")(session);

// view engine set
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// DB connection
const dburl = "mongodb://localhost/web1";
mongoose.connect(dburl, { useNewUrlParser: true });

// Define Model
var user = require("./models/user");
var store = new MongoDBStore({
  // session save storage
  uri: dburl,
  collection: "session",
});

// error exception
store.on("error", function (err) {
  console.log(err);
});

app.use(
  session({
    secret: "kbp0237", // encoding key
    resave: false,
    saveUninitialized: true,
    rolling: true, // change the session when move the page
    cookie: { maxAge: 1000 * 60 * 60 }, // valid time
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// routes
const route = require("./routes/index")(
  app,
  crypto,
  passport,
  LocalStrategy,
  user
);

// listen
app.listen(PORT, function () {
  console.log("Example app listening on port" + PORT);
});
