module.exports = function (app, fs) {
  // home API
  app.get("/", function (req, res) {
    var sess = req.session;

    res.render("index", {
      title: "MY HOMEPAGE",
      length: 5,
      name: sess.name,
      username: sess.username,
    });
  });

  // GET list API
  app.get("/list", function (req, res) {
    fs.readFile(
      __dirname + "/../data/" + "user.json",
      "utf8",
      function (err, data) {
        console.log(data);
        res.end(data);
      }
    );
  });

  // GET user data by username API
  app.get("/getUser/:username", function (req, res) {
    fs.readFile(__dirname + "/../data/user.json", "utf8", function (err, data) {
      var users = JSON.parse(data);
      res.json(users[req.params.username]);
    });
  });

  // POST add new user API
  app.post("/addUser/:username", function (req, res) {
    var result = {};
    var username = req.params.username;

    // check req validity
    if (!req.body["password"] || !req.body["name"]) {
      result["success"] = 0;
      result["error"] = "invalid request";
      res.json(result);
      return;
    }

    // load data & check duplication
    fs.readFile(__dirname + "/../data/user.json", "utf8", function (err, data) {
      var users = JSON.parse(data);

      if (users[username]) {
        // duplication found
        result["success"] = 0;
        result["error"] = "duplicate";
        res.json(result);
        return;
      }

      // add to data
      users[username] = req.body;

      // save data
      fs.writeFile(
        __dirname + "/../data/user.json",
        JSON.stringify(users, null, "\t"),
        "utf8",
        function (err, data) {
          result = { success: 1 };
          res.json(result);
        }
      );
    });
  });

  // PUT update user API
  app.put("/addUser/:username", function (req, res) {
    var result = {};
    var username = req.params.username;

    // check req validity
    if (!req.body["password"] || !req.body["name"]) {
      result["success"] = 0;
      result["error"] = "invalid request";
      res.json(result);
      return;
    }

    // load data & check duplication
    fs.readFile(__dirname + "/../data/user.json", "utf8", function (err, data) {
      var users = JSON.parse(data);
      // ADD/MODIFY DATA
      users[username] = req.body;

      // SAVE DATA
      fs.writeFile(
        __dirname + "/../data/user.json",
        JSON.stringify(users, null, "\t"),
        "utf8",
        function (err, data) {
          result = { success: 1 };
          res.json(result);
        }
      );
    });
  });

  // DELETE the user by username API
  app.delete("/deleteUser/:username", function (req, res) {
    var result = {};

    // load data
    fs.readFile(__dirname + "/../data/user.json", "utf8", function (err, data) {
      var users = JSON.parse(data);

      // if not found
      if (!users[req.params.username]) {
        result["success"] = 0;
        result["error"] = "Not Found";
        res.json(result);
        return;
      }

      delete users[req.params.username];

      fs.writeFile(
        __dirname + "/../data/user.json",
        JSON.stringify(users, null, "\t"),
        "utf8",
        function (err, data) {
          result["success"] = 1;
          res.json(result);
          return;
        }
      );
    });
  });

  // login API
  app.get("/login/:username/:password", function (req, res) {
    var sess;
    sess = req.session;

    fs.readFile(__dirname + "/../data/user.json", "utf8", function (err, data) {
      var users = JSON.parse(data);
      var username = req.params.username;
      var password = req.params.password;
      var result = {};

      if (!users[username]) {
        // USERNAME NOT FOUND
        result["success"] = 0;
        result["error"] = "Not Found";
        res.json(result);
        return;
      }

      if (users[username]["password"] == password) {
        result["success"] = 1;
        sess.username = username;
        sess.name = users[username]["name"];
        res.json(result);
      } else {
        result["success"] = 0;
        result["error"] = "Incorrect";
        res.json(result);
      }
    });
  });

  // logout API
  app.get("/logout", function (req, res) {
    sess = req.session;

    if (sess.username) {
      req.session.destroy(function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      });
    } else {
      res.redirect("/");
    }
  });
};
