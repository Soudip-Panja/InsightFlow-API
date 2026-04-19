const express = require("express");

const app = express();

const SECRET_KEY = "superadmin";

app.use(express.json());

app.post("/admin/login", (req, res) => {
  const { secret } = req.body;
  if (secret === SECRET_KEY) {
    res.json({ message: "Access Granted" });
  } else {
    res.json({ message: "Invalid Secret" });
  }
});

PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
