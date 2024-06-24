const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Load users from file
let users = loadUsers();

// Handle login form submission
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  bcrypt.compare(password, user.passwordHash, (err, result) => {
    if (result) {
      return res.status(200).json({ redirectUrl: user.redirectUrl });
    } else {
      return res.status(401).json({ error: "Invalid password" });
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

module.exports = app;
