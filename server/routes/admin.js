const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin");
const { loginCheck, isAuth, isSuperAdmin } = require("../middleware/auth");

// Super admin only routes
router.get("/all-admins", loginCheck, isAuth, isSuperAdmin, adminController.getAllAdmins);
router.post("/create-admin", loginCheck, isAuth, isSuperAdmin, adminController.createAdmin);
router.put("/update-admin/:id", loginCheck, isAuth, isSuperAdmin, adminController.updateAdmin);
router.delete("/delete-admin/:id", loginCheck, isAuth, isSuperAdmin, adminController.deleteAdmin);

module.exports = router;