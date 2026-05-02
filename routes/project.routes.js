const express = require("express");
const router = express.Router();

const Project = require("../models/project.model");

const verifyJWT = require("../middleware/auth.middleware");
router.use(verifyJWT);

//Create Project
async function createProjet(projectData) {
  try {
    const { name, description } = projectData;

    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      throw new Error("Project already exists.");
    }

    const newProject = new Project({ name, description });
    const saveProject = await newProject.save();
    return saveProject;
  } catch (error) {
    console.log("Error adding new project:", error.message);
  }
}

router.post("/", async (req, res) => {
  try {
    const data = await createProjet(req.body);
    res
      .status(201)
      .json({ message: "Project created successfully", project: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all projects
async function getAllProjects() {
  try {
    const projects = await Project.find();
    return projects;
  } catch (error) {
    console.log("Error fetching projects:", error.message);
    throw error;
  }
}

router.get("/", async (req, res) => {
  try {
    const data = await getAllProjects();

    res.status(200).json({
      message: "Projects fetched successfully",
      projects: data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
