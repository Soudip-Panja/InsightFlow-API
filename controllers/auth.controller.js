const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const verifyJWT = require("../middleware/auth.middleware");
const { JWT_SECRET, PORT } = require("../config/env");

const PASSWORD = "superadmin";
const EMAIL = "demo123admin@gmail.com";

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === EMAIL && password === PASSWORD) {
    const token = jwt.sign({ role: "admin", email: EMAIL }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } else {
    res.json({ message: "Invalid Secret" });
  }
});

router.get("/admin", verifyJWT, (req, res) => {
  res.json({ message: " Test protected route accessable" });
});

module.exports = router;
