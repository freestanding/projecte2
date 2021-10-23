const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const morgan = require("morgan");
const app = express();
//cookie
const TWO_HOURS = 1000 * 60 * 60 * 2;
const IN_PROD = "development" === "production";
const SESS_SECRET = "ssh!quiet,it'asecret!";

app.use(
  session({
    secret: "test",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  session({
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
      maxAge: TWO_HOURS,
      sameSite: true, //strict
      secure: IN_PROD,
    },
  })
);

// settings
app.set("port", process.env.PORT || 3030);

// on estan les vistes

app.set("views", path.join(__dirname, "views"));

//motor de templating

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    partialsDir: __dirname + "/views/layouts",
  })
);

app.set("view engine", ".hbs");

//routes
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(require("./routes/routes"));

//altres fitxes

app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
