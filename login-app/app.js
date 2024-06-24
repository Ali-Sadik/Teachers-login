const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files from the same directory

// Load users from file
let users = loadUsers();

// Serve the index.html page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
