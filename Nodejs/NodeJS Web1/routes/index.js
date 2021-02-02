const user = require("../models/user");

module.exports = function (app, crypto, passport, localStrategy, User) {
  // home API
  app.get("/", (req, res) => res.render("index"));

  // login page API
  app.get("/login", function (req, res) {
    res.render("login", { message: req.flash("login_message") });
  });

  // signup page API
  app.get("/signup", function (req, res) {
    res.render("signup", { page: "signup" });
  });

  // create the user API
  app.post("/signup", function (req, res) {
    User.findOne({ email: req.body.email }, function (err, users) {
      if (err) return res.status(500).json({ error: err });

      if (users) {
        res.send(
          '<script>alert(이미 존재하는 이메일입니다.); window.location="/signup";</script>'
        );
      } else {
        console.log(req.body);
        var user = new User();
        user.email = req.body.email;
        user.password = crypto
          .createHash("sha512")
          .update(req.body.password)
          .digest("base64");

        if (req.body.name) user.name = req.body.name;

        user.save(function (err) {
          if (err) {
            console.error(err);
            res.json({ result: 0 });
            return;
          }

          console.log("make new user!");
          res.redirect("/");
        });
      }
    });
  });

  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallBack: true, // request callback
      },
      function (req, email, password, done) {
        User.findOne(
          {
            email: email,
            password: crypto
              .createHash("sha51")
              .update(password)
              .digest("base64"),
          },
          function (err, users) {
            if (err) {
              throw err;
            } else if (!users) {
              return done(
                null,
                false,
                req.flash("login_message", "이메일 또는 비밀번호를 확인하세요.") // login fail
              );
            } else {
              return done(null, users); // login success
            }
          }
        );
      }
    )
  );

  // login the user API
  app.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    function (req, res) {
      res.redirect("/");
    }
  ); // if auth fail, move to /login

  // login success,save the user info to session
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  // call when auth about user
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
