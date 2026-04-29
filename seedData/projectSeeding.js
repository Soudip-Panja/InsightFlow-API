const fs = require("fs");
const Project = require("../models/project.model");

const jsonData = fs.readFileSync("./data/projectData.json", "utf-8");
const projectsData = JSON.parse(jsonData);

async function seedProject() {
  try {
    for (const projectData of projectsData) {
      const newProject = new Project({
        name: projectData.name,
        description: projectData.description,
      });

      await newProject.save();
    }

    console.log("Project data successfully seeded.");
  } catch (error) {
    console.log("Error seeding project data: ", error);
  }
}

module.exports = { seedProject };
