const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import User model
const User = require("./models/users");

// Connect to database
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingAdmin = await User.findOne({ email: "admin@admin.com" });
    
    if (existingAdmin) {
      console.log("Super admin already exists!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin", 10);

    // Create super admin
    const superAdmin = new User({
      name: "Super Admin",
      email: "admin@admin.com", 
      password: hashedPassword,
      userRole: 2, // 2 = super admin, 1 = admin, 0 = customer
    });

    await superAdmin.save();
    console.log("Super admin created successfully!");
    console.log("Email: admin@admin.com");
    console.log("Password: admin");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating super admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();