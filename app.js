const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const fs = require("fs");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files from the same directory
app.use(express.static("public")); // Serve static files (e.g., login.html)

// Load users from file
let users = loadUsers();

// Serve login page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// Handle login form submission
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.redirect("/login?error=user-not-found");
  }
  bcrypt.compare(password, user.passwordHash, (err, result) => {
    if (result) {
      return res.redirect(user.redirectUrl); // Redirect based on user's redirection URL
    } else {
      return res.redirect("/login?error=invalid-password");
    }
  });
});

// Load users from file
function loadUsers() {
  try {
    const data = fs.readFileSync("users.json");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading users:", err);
    return [];
  }
}

const PORT = process.env.PORT || 2998;
app.listen(PORT, () => {
  console.log("Server==\x1b[0m\x1b[32msuccess\x1b[0m\x1b[37m__________\x1b[0m\x1b[33mapp.js\x1b[0m\x1b[37m running \x1b[0m\x1b[37mTeachers-login\x1b[0m\x1b[37m__________\x1b[0mon \x1b[31mport \x1b[0m\x1b[31m2998\x1b[0m");
});
