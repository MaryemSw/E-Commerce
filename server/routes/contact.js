const express = require("express");
const router = express.Router();
const contactController = require("../controller/contact");
const { loginCheck, isAuth, isAdmin } = require("../middleware/auth");

// Public route
router.post("/submit", contactController.submitContact);

// Admin routes
router.get("/admin/all-contacts", loginCheck, isAuth, isAdmin, contactController.getAllContacts);
router.put("/admin/contact-status/:id", loginCheck, isAuth, isAdmin, contactController.updateContactStatus);
router.delete("/admin/delete-contact/:id", loginCheck, isAuth, isAdmin, contactController.deleteContact);

module.exports = router;