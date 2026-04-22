const express = require("express");
const jwt = require("jsonwebtoken");

const verifyJWT = require("./middleware/auth.middleware");
const { JWT_SECRET, PORT } = require("./config/env");

const app = express();

const PASSWORD = "superadmin";
const EMAIL = "demo123admin@gmail.com";

app.use(express.json());

app.post("/admin/login", (req, res) => {
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

app.get("/admin/auth/login", verifyJWT, (req, res) => {
  res.json({ message: " Test protected route accessable" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
