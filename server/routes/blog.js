const express = require("express");
const router = express.Router();
const blogController = require("../controller/blog");
const { loginCheck, isAuth, isAdmin } = require("../middleware/auth");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/blogs");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Public routes
router.get("/all-blogs", blogController.getAllBlogs);
router.get("/blog/:id", blogController.getBlogById);

// Admin routes
router.get("/admin/all-blogs", loginCheck, isAuth, isAdmin, blogController.getAllBlogsAdmin);
router.post("/admin/add-blog", loginCheck, isAuth, isAdmin, upload.single("image"), blogController.createBlog);
router.put("/admin/edit-blog/:id", loginCheck, isAuth, isAdmin, upload.single("image"), blogController.updateBlog);
router.delete("/admin/delete-blog/:id", loginCheck, isAuth, isAdmin, blogController.deleteBlog);

module.exports = router;