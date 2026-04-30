const fs = require("fs");
const Team = require("../models/team.model");

const jsonData = fs.readFileSync("./data/teamData.json", "utf-8");
const teamsData = JSON.parse(jsonData);

async function seedTeam() {
  try {
    for (const teamData of teamsData) {
      const newTeam = new Team({
        name: teamData.name,
        description: teamData.description,
      });

      await newTeam.save();
    }

    console.log("Team data successfully seeded.");
  } catch (error) {
    console.log("Error seeding team data:", error);
  }
}

module.exports = { seedTeam };
