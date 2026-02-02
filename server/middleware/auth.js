const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const userModel = require("../models/users");

exports.loginCheck = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    token = token.replace("Bearer ", "");
    const decode = jwt.verify(token, JWT_SECRET);
    req.userDetails = decode;
    next();
  } catch (err) {
    res.status(401).json({
      error: "You must be logged in",
    });
  }
};

exports.isAuth = (req, res, next) => {
  // For admin routes, we don't need body validation
  next();
};

exports.isAdmin = async (req, res, next) => {
  try {
    let reqUser = await userModel.findById(req.userDetails._id);
    if (!reqUser || (reqUser.userRole !== 1 && reqUser.userRole !== 2)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
};

exports.isSuperAdmin = async (req, res, next) => {
  try {
    let reqUser = await userModel.findById(req.userDetails._id);
    if (!reqUser || reqUser.userRole !== 2) {
      return res.status(403).json({ error: "Super admin access required" });
    }
    next();
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
};
