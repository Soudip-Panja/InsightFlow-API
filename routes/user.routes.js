const express = require("express");
const router = express.Router();

const User = require("../models/user.model");
const verifyJWT = require("../middleware/auth.middleware");
router.use(verifyJWT);

//Get user details
async function getLoggedInUser(userId) {
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

router.get("/me", async (req, res) => {
  try {
    const user = await getLoggedInUser(req.user.userId);

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
});

module.exports = router;
