const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the 'public' directory

// Load users from file
let users = loadUsers();

// Serve login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Handle login form submission
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`Received login attempt for username: ${username}`);

  const user = users.find((user) => user.username === username);
  if (!user) {
    console.log("User not found");
    return res.redirect("/login?error=user-not-found");
  }

  bcrypt.compare(password, user.passwordHash, (err, result) => {
    if (err) {
      console.error("Error comparing passwords:", err);
      return res.redirect("/login?error=server-error");
    }

    if (result) {
      console.log("Login successful");
      return res.redirect(user.redirectUrl); // Redirect based on user's redirection URL
    } else {
      console.log("Invalid password");
      return res.redirect("/login?error=invalid-password");
    }
  });
});

// Load users from file
function loadUsers() {
  try {
    const data = fs.readFileSync(path.join(__dirname, "users.json"));
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading users:", err);
    return [];
  }
}

const PORT = process.env.PORT || 2998;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
