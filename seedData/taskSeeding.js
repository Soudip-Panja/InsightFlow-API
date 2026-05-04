const fs = require("fs");
const Task = require("../models/task.model");

const jsonData = fs.readFileSync("./data/taskData.json", "utf-8");
const tasksData = JSON.parse(jsonData);

async function seedTask() {
  try {
    for (const taskData of tasksData) {
      const newTask = new Task({
        name: taskData.name,
        project: taskData.project,
        team: taskData.team,
        owners: taskData.owners,
        tags: taskData.tags,
        timeToComplete: taskData.timeToComplete,
        status: taskData.status,
      });

      await newTask.save();
    }

    console.log("Task data successfully seeded.");
  } catch (error) {
    console.log("Error seeding task data: ", error);
  }
}

module.exports = { seedTask };
