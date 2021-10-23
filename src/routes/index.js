const admin = require("firebase-admin");
var session;
// var serviceAccount = require(process.env.GOOGLE_APPLICATIONS_CREDENTIALS);

var serviceAccount = require("../../database-c4562-firebase-adminsdk-d9yjs-0f6b3cc33c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://database-c4562-default-rtdb.europe-west1.firebasedatabase.app",
});
const db = admin.database();

const express = require("express");
const router = express.Router();
const user = { state: false, type: false };
const priv = { no_admin: true };

function login(req, res, next) {
  if (!req.session.userId) {
    res.redirect("/login");
  } else {
    next();
  }
}

function home(req, res, next) {
  if (req.session.userId) {
    res.redirect("/");
  } else {
    next();
  }
}

function isLogged(req, res, next) {
  if (req.session.userId) {
    user.state = true;
  } else {
    user.state = false;
  }
  next();
}

function isAdmin(req, res, next) {
  if (req.body.user == "admin" && req.body.password == 1234) {
    user.type = true;
  } else {
    user.type = false;
  }
  next();
}
function backendperms(req, res, next) {
  if (user.type) {
    next();
  } else {
    res.render("login", {
      title: "no_admin",
      perms: { no_admin: true },
      user,
    });
  }
}

// function isAdmin(req, res, next) {
//   if (!user.type) {
//     priv.no_admin = true;
//   } else {
//     priv.no_admin = false;
//     next();
//   }
// }

router.get("/", isLogged, (req, res) => {
  const t1 = db.ref("servicios_db").limitToLast(3).get();
  const t2 = db.ref("products").limitToLast(3).get();
  Promise.all([t1, t2]).then(([snapshot1, snapshot2]) => {
    data = snapshot1.val();
    data2 = snapshot2.val();
    res.render("index", {
      servicios_db: data,
      products: data2,
      title: "Home",
      active: { Home: true },
      user,
    });
  });
});

router.get("/catalogo", isLogged, (req, res) => {
  db.ref("products").once("value", (snapshot) => {
    data = snapshot.val();
    res.render("catalogo", {
      products: data,
      title: "Catalogo",
      active: { Catalogo: true },
      user,
    });
  });
});

router.get("/servicios", isLogged, (req, res) => {
  db.ref("servicios_db").once("value", (snapshot) => {
    data = snapshot.val();
    res.render("servicios", {
      servicios_db: data,
      title: "Servicios",
      active: { Servicios: true },
      user,
    });
  });
});

router.get("/contacte", isLogged, (req, res) => {
  res.render("contacte", {
    title: "Contacte",
    active: { Contacte: true },
    user,
  });
});

router.get("/backend", login, isLogged, backendperms, (req, res) => {
  const t1 = db.ref("servicios_db").get();
  const t2 = db.ref("products").get();
  Promise.all([t1, t2]).then(([snapshot1, snapshot2]) => {
    data = snapshot1.val();
    data2 = snapshot2.val();
    res.render("backend", { servicios_db: data, products: data2, user });
  });
});

router.get("/crear_product", login, isLogged, (req, res) => {
  db.ref("products").once("value", (snapshot) => {
    data = snapshot.val();
    res.render("crear_product", { products: data, user });
  });
});

router.post("/new-product", login, isLogged, (req, res) => {
  const newProduct = {
    title: req.body.title,
    desc: req.body.desc,
    foto: req.body.foto,
    precio: req.body.precio,
  };
  db.ref("products").push(newProduct);
  res.redirect("/backend");
});

router.get("/delete-product/:id", login, isLogged, (req, res) => {
  db.ref("products/" + req.params.id).remove();
  res.redirect("/backend");
});

// router.get("/crear_servicio", login, (req, res) => {
//   db.ref("servicios_db").once("value", (snapshot) => {
//     data = snapshot.val();
//     res.render("crear_servicio", { servicios_db: data });
//   });
// });

router.post("/new-servicio", login, isLogged, (req, res) => {
  const newServicio = {
    title: req.body.title,
    desc: req.body.desc,
    foto: req.body.foto,
    precio: req.body.precio,
  };
  db.ref("servicios_db").push(newServicio);
  res.redirect("/backend");
});

router.get("/delete-servicio/:id", login, isLogged, (req, res) => {
  db.ref("servicios_db/" + req.params.id).remove();
  res.redirect("/backend");
});

//SESSION

router.get("/login", isLogged, (req, res) => {
  res.render("login");
});

router.post("/login", isLogged, isAdmin, (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).send("Fill all the credentials");
  }
  if (user && password) {
    var query = db.ref("users").orderByKey();
    query.once("value").then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var user = childSnapshot.val().user;
        var pw = childSnapshot.val().password;
        if (req.body.user == "admin" && req.body.password == 1234) {
          req.session.userId = childSnapshot;
          res.redirect("/backend");
        } else if (user == req.body.user && pw == req.body.password) {
          req.session.userId = childSnapshot;
          res.redirect("/");
        }
        res.render("login", {
          title: "login_err",
          err: { login_err: true },
        });
      });
    });
  }
});

router.post("/logout", isLogged, function (req, res) {
  req.session.userId = null;
  user.type = false;
  res.send("ok");
});

module.exports = router;
