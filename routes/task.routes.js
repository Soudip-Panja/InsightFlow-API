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

//Update Task
async function updateTask(taskId, updateData) {
  try {
    const { name, project, team, owners, tags, timeToComplete, status } =
      updateData;

    let updateFields = {};

    if (name) {
      updateFields.name = name;
    }

    if (project) {
      const existingProject = await Project.findOne({ name: project });
      if (!existingProject) {
        throw new Error("Project not found");
      }
      updateFields.project = existingProject._id;
    }

    if (team) {
      const existingTeam = await Team.findById(team);
      if (!existingTeam) {
        throw new Error("Team not found");
      }
      updateFields.team = team;
    }

    if (owners) {
      if (!Array.isArray(owners) || owners.length === 0) {
        throw new Error("Owners must be a non-empty array");
      }

      for (let i = 0; i < owners.length; i++) {
        const user = await User.findById(owners[i]);
        if (!user) {
          throw new Error(`User not found with id ${owners[i]}`);
        }
      }

      updateFields.owners = owners;
    }

    if (tags) {
      updateFields.tags = tags;
    }

    if (timeToComplete !== undefined) {
      if (typeof timeToComplete !== "number") {
        throw new Error("timeToComplete must be a number");
      }
      updateFields.timeToComplete = timeToComplete;
    }

    if (status) {
      const validStatus = ["To Do", "In Progress", "Completed", "Blocked"];
      if (!validStatus.includes(status)) {
        throw new Error("Invalid status value");
      }
      updateFields.status = status;
    }

    updateFields.updatedAt = Date.now();

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, {
      returnDocument: "after",
    });

    if (!updatedTask) {
      throw new Error("Task not found");
    }

    return updatedTask;
  } catch (error) {
    console.log("Error updating task:", error.message);
    throw error;
  }
}

router.post("/:id", async (req, res) => {
  try {
    const data = await updateTask(req.params.id, req.body);

    res.status(200).json({
      message: "Task updated successfully",
      task: data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//Delete task
async function deleteTask(taskId) {
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      throw new Error("Task not found");
    }

    return deletedTask;
  } catch (error) {
    console.log("Error deleting task:", error.message);
    throw error;
  }
}

router.delete("/:id", async (req, res) => {
  try {
    const data = await deleteTask(req.params.id);

    res.status(200).json({
      message: "Task deleted successfully",
      task: data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// // Filter taskes
// async function getFilteredTasks(queryParams) {
//   try {
//     const { team, owner, tags, project, status } = queryParams;

//     let filter = {};

//     if (team) {
//       filter.team = team;
//     }

//     if (owner) {
//       filter.owners = owner;
//     }

//     if (tags) {
//       filter.tags = tags;
//     }

//     if (project) {
//       const existingProject = await Project.findOne({ name: project });
//       if (!existingProject) {
//         throw new Error("Project not found");
//       }
//       filter.project = existingProject._id;
//     }

//     if (status) {
//       const validStatus = ["To Do", "In Progress", "Completed", "Blocked"];
//       if (!validStatus.includes(status)) {
//         throw new Error("Invalid status value");
//       }
//       filter.status = status;
//     }

//     const tasks = await Task.find(filter)
//       .populate("project", "name")
//       .populate("team", "name")
//       .populate("owners", "name email");

//     return tasks;
//   } catch (error) {
//     console.log("Error fetching tasks:", error.message);
//     throw error;
//   }
// }

// router.get("/", async (req, res) => {
//   try {
//     const data = await getFilteredTasks(req.query);

//     res.status(200).json({
//       message: "Filtered tasks fetched successfully",
//       tasks: data,
//     });
//   } catch (error) {
//     res.status(400).json({
//       message: error.message,
//     });
//   }
// });

module.exports = router;
