const express = require("express");
const app = express();
const pool = require("./server");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/authentication", (req, res, next) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
  } catch (error) {
    next(err);
  }
  var email = req.body.email;
  var password = req.body.password;
  //   if (email && password) {
  const [getUser, f] = pool.query(
    "SELECT * FROM user WHERE email = ? AND password = ?",[
        email, password]
  );
  if (getUser.length != 0) {
    // req.session.login = true;
    // req.session.email = email;
    // req.session.role = result[0].role;
    // res.redirect("/home");
    console.log(getUser)
  }
  else{
    res.send("Incorrect Username or Password");
  }
  //   } else {
  //     res.send("Please enter Username and Password");
  //     res.end();
  //   }
});

app.get("/check", async (req, res) => {
  const [getUser, f] = await pool.query("SELECT * FROM user");
  res.json(getUser);
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
