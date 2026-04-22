const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"];

  if(!token){
    return res.status(401).json({message: "No token provided."})
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = verifyJWT