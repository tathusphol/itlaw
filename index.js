const express = require("express");
const app = express();
const pool = require("./server");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  if (req.session.login) {
    res.redirect("/homepage");
  } else {
    res.sendFile(path.join(__dirname + "/index.html"));
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.post("/authentication", async (req, res, next) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    // console.log(email, password);
    const [getUser, f] = await pool.query(
      "SELECT * FROM user WHERE email = ? AND password = ?",
      [email, password]
    );
    req.session.IDCard = getUser[0].IDCard;
    req.session.login = true;
    req.session.email = email;
    req.session.role = getUser[0].role;
    res.redirect("/homepage");
    // res.json(getUser)
  } catch (error) {
    // next(error)
    res.send("Incorrect Username or Password");
  }
});

app.get("/homepage", async (req, res, next) => {
  if (req.session.login) {
    res.sendFile(path.join(__dirname + "/home.html"));
  } else {
    res.send("You are not logged in");
  }
});

app.post("/alluser", async (req, res, next) => {
  if (req.session.login) {
    if (req.session.role == "Admin") {
      const [getAllUser, f] = await pool.query("SELECT * FROM user");
      let users =
        "<div class='flex justify-center items-center max-h-screen'><div><table class='w-full text-sm text-left text-gray-500 dark:text-gray-400'><thead class='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'><tr><th scope='col' class='py-3 px-6'>ID</th><th scope='col' class='py-3 px-6'>IDCARD</th><th scope='col' class='py-3 px-6'>USERNAME</th><th scope='col' class='py-3 px-6'>PHONE</th><th scope='col' class='py-3 px-6'>EMAIL</th><th scope='col' class='py-3 px-6'>ROLE</th></tr></thead><tbody>";
      getAllUser.forEach((value) => {
        users += `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            ${value.id}
          </th>
          <td class="py-4 px-6">
            ${value.IDCard}
          </td>
          <td class="py-4 px-6">
            ${value.username}
          </td>
          <td class="py-4 px-6">
            ${value.phone}
          </td>
          <td class="py-4 px-6">
            ${value.email}
          </td>
          <td class="py-4 px-6">
            ${value.role}
          </td>
      </tr>`;
      });
      users += `</tbody></table></div></div><script src="https://cdn.tailwindcss.com"></script>`;
      res.send(users);
    } else {
      res.status(403);
    }
    res.end();
  } else {
    res.send("You are not logged in");
  }
});

app.post("/allstudent", async (req, res, next) => {
  if (req.session.login) {
    if (req.session.role == "Admin" || req.session.role == "Teacher") {
      const [getAllUser, f] = await pool.query(
        "SELECT * FROM user WHERE role = ?",
        ["Student"]
      );
      let users =
        "<div class='flex justify-center items-center max-h-screen'><div><table class='w-full text-sm text-left text-gray-500 dark:text-gray-400'><thead class='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'><tr><th scope='col' class='py-3 px-6'>ID</th><th scope='col' class='py-3 px-6'>IDCARD</th><th scope='col' class='py-3 px-6'>USERNAME</th><th scope='col' class='py-3 px-6'>PHONE</th><th scope='col' class='py-3 px-6'>EMAIL</th><th scope='col' class='py-3 px-6'>ROLE</th></tr></thead><tbody>";
      getAllUser.forEach((value) => {
        users += `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            ${value.id}
          </th>
          <td class="py-4 px-6">
            ${value.IDCard}
          </td>
          <td class="py-4 px-6">
            ${value.username}
          </td>
          <td class="py-4 px-6">
            ${value.phone}
          </td>
          <td class="py-4 px-6">
            ${value.email}
          </td>
          <td class="py-4 px-6">
            ${value.role}
          </td>
      </tr>`;
      });
      users += `</tbody></table></div></div><script src="https://cdn.tailwindcss.com"></script>`;
      res.send(users);
    } else {
      res.status(403);
    }
    res.end();
  } else {
    res.send("You are not logged in");
  }
});
app.post("/MyInformation", async (req, res, next) => {
  if (req.session.login) {
    const [myinformation, f] = await pool.query(
      "SELECT * FROM user WHERE IDCard = ?",
      [req.session.IDCard]
    );
    let users =
      "<div class='flex justify-center items-center max-h-screen'><div><table class='w-full text-sm text-left text-gray-500 dark:text-gray-400'><thead class='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'><tr><th scope='col' class='py-3 px-6'>ID</th><th scope='col' class='py-3 px-6'>IDCARD</th><th scope='col' class='py-3 px-6'>USERNAME</th><th scope='col' class='py-3 px-6'>PHONE</th><th scope='col' class='py-3 px-6'>EMAIL</th><th scope='col' class='py-3 px-6'>ROLE</th></tr></thead><tbody>";
    users += `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            ${myinformation[0].id}
          </th>
          <td class="py-4 px-6">
            ${myinformation[0].IDCard}
          </td>
          <td class="py-4 px-6">
            ${myinformation[0].username}
          </td>
          <td class="py-4 px-6">
            ${myinformation[0].phone}
          </td>
          <td class="py-4 px-6">
            ${myinformation[0].email}
          </td>
          <td class="py-4 px-6">
            ${myinformation[0].role}
          </td>
      </tr>`;
    users += `</tbody></table></div></div><script src="https://cdn.tailwindcss.com"></script>`;
    res.send(users);
  } else {
    res.send("You are not logged in");
  }
});

app.get("/check", async (req, res, next) => {
  const [getUser, f] = await pool.query("SELECT * FROM user");
  res.json(getUser);
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
