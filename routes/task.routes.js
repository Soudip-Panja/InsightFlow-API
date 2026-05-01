const express = require("express");
const router = express.Router();

const Task = require("../models/task.model");
const Project = require("../models/project.model");
const Team = require("../models/team.model");
const User = require("../models/user.model");

const verifyJWT = require("../middleware/auth.middleware");
router.use(verifyJWT);

//Create a new task
async function createTask(taskData) {
  try {
    const { name, project, team, owners, tags, timeToComplete, status } =
      taskData;

    if (!name) {
      throw new Error("Task name is required");
    }

    const existingProject = await Project.findOne({ name: project });
    if (!existingProject) {
      throw new Error("Project not found");
    }

    const existingTeam = await Team.findById(team);
    if (!existingTeam) {
      throw new Error("Team not found");
    }

    if (!owners || !Array.isArray(owners) || owners.length === 0) {
      throw new Error("Owners must be a non-empty array");
    }

    for (let i = 0; i < owners.length; i++) {
      const user = await User.findById(owners[i]);
      if (!user) {
        throw new Error(`User not found with id ${owners[i]}`);
      }
    }

    if (typeof timeToComplete !== "number") {
      throw new Error("timeToComplete must be a number");
    }

    const validStatus = ["To Do", "In Progress", "Completed", "Blocked"];
    if (status && !validStatus.includes(status)) {
      throw new Error("Invalid status value");
    }

    const newTask = new Task({
      name,
      project: existingProject._id,
      team,
      owners,
      tags,
      timeToComplete,
      status,
    });

    const savedTask = await newTask.save();
    return savedTask;
  } catch (error) {
    console.log("Error creating task:", error.message);
    throw error;
  }
}

router.post("/", async (req, res) => {
  try {
    const data = await createTask(req.body);

    res.status(201).json({
      message: "Task created successfully",
      task: data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
