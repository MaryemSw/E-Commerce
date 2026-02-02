const Blog = require("../models/blog");
const fs = require("fs");

class BlogController {
  async getAllBlogs(req, res) {
    try {
      const blogs = await Blog.find({ status: "published" }).sort({ createdAt: -1 });
      res.json({ blogs });
    } catch (error) {
      res.status(400).json({ error: "Failed to fetch blogs" });
    }
  }

  async getAllBlogsAdmin(req, res) {
    try {
      const blogs = await Blog.find({}).sort({ createdAt: -1 });
      res.json({ blogs });
    } catch (error) {
      res.status(400).json({ error: "Failed to fetch blogs" });
    }
  }

  async getBlogById(req, res) {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      res.json({ blog });
    } catch (error) {
      res.status(400).json({ error: "Failed to fetch blog" });
    }
  }

  async createBlog(req, res) {
    try {
      const { title, content, excerpt, author, status } = req.body;
      const image = req.file ? `/uploads/blogs/${req.file.filename}` : "";

      const blog = new Blog({
        title,
        content,
        excerpt,
        author,
        image,
        status,
      });

      await blog.save();
      res.json({ message: "Blog created successfully", blog });
    } catch (error) {
      res.status(400).json({ error: "Failed to create blog" });
    }
  }

  async updateBlog(req, res) {
    try {
      const { title, content, excerpt, author, status } = req.body;
      const blog = await Blog.findById(req.params.id);

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      let image = blog.image;
      if (req.file) {
        if (blog.image && fs.existsSync(`./public${blog.image}`)) {
          fs.unlinkSync(`./public${blog.image}`);
        }
        image = `/uploads/blogs/${req.file.filename}`;
      }

      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        { title, content, excerpt, author, image, status },
        { new: true }
      );

      res.json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
      res.status(400).json({ error: "Failed to update blog" });
    }
  }

  async deleteBlog(req, res) {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      if (blog.image && fs.existsSync(`./public${blog.image}`)) {
        fs.unlinkSync(`./public${blog.image}`);
      }

      await Blog.findByIdAndDelete(req.params.id);
      res.json({ message: "Blog deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete blog" });
    }
  }
}

module.exports = new BlogController();