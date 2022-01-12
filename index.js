if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
// const helmet = require("helmet");

const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const MongoStore = require("connect-mongo")(session);

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/myyelpcamp";

// "mongodb://localhost:27017/myyelpcamp"
// dbUrl

const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/myyelpcamp";

console.log(dbUrl)

mongoose.connect(dbUrl, {
  useNewURLParser: true,
  useUnifiedtopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// mongosanitize
app.use(
  mongoSanitize({
    replaceWith: "_"
  })
);

<<<<<<< HEAD
const secret = process.env.SECRET || "thisshouldbeasecret"

const store = new MongoStore({
  url: dbUrl,
  secret: "thisisasecret",
  touchAfter: 24 * 60 * 60
=======
const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret
  }
>>>>>>> 0ffffb17fa8e465414cc8272e48089f71e547b3e
});

store.on("error", function(e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

//sessions

app.use(session(sessionConfig));
app.use(flash());
// app.use(helmet());

//passport authentication

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//how to store and unstore it in the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session);
  // console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  // console.log(err);
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No Something Went wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.Port || 3000;
app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
