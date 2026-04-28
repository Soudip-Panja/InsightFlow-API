const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

const { seedUser } = require("./seedData/usersSeeding");
// seedUser();

const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/env");

const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require("./controllers/auth.controller");
const projectRoutes = require("./routes/project.routes");

app.use("/v1/auth", authRoutes);
app.use("/v1/projects", projectRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
