const User = require("../models/users");
const bcrypt = require("bcryptjs");

class AdminController {
  async getAllAdmins(req, res) {
    try {
      const admins = await User.find({ userRole: { $in: [1, 2] } })
        .select("-password")
        .sort({ createdAt: -1 });
      res.json({ admins });
    } catch (error) {
      res.status(400).json({ error: "Failed to fetch admins" });
    }
  }

  async createAdmin(req, res) {
    try {
      const { name, email, password, userRole } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newAdmin = new User({
        name,
        email,
        password: hashedPassword,
        userRole: userRole || 1, // Default to admin role
      });

      await newAdmin.save();
      res.json({ message: "Admin created successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to create admin" });
    }
  }

  async updateAdmin(req, res) {
    try {
      const { name, email, userRole } = req.body;
      const adminId = req.params.id;

      // Prevent modifying super admin
      const targetAdmin = await User.findById(adminId);
      if (targetAdmin.userRole === 2 && targetAdmin.email === "admin@admin.com") {
        return res.status(403).json({ error: "Cannot modify super admin" });
      }

      const updatedAdmin = await User.findByIdAndUpdate(
        adminId,
        { name, email, userRole },
        { new: true }
      ).select("-password");

      res.json({ message: "Admin updated successfully", admin: updatedAdmin });
    } catch (error) {
      res.status(400).json({ error: "Failed to update admin" });
    }
  }

  async deleteAdmin(req, res) {
    try {
      const adminId = req.params.id;
      
      // Prevent deleting super admin
      const targetAdmin = await User.findById(adminId);
      if (targetAdmin.userRole === 2 && targetAdmin.email === "admin@admin.com") {
        return res.status(403).json({ error: "Cannot delete super admin" });
      }

      await User.findByIdAndDelete(adminId);
      res.json({ message: "Admin deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete admin" });
    }
  }
}

module.exports = new AdminController();