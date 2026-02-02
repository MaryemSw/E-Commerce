import React, { Fragment, useState, useEffect } from "react";
import Layout from "../layout";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blog/all-blogs");
      const data = await response.json();
      if (response.ok) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Fragment>
        <Layout>
          <div className="container mx-auto px-4 py-8 text-center">
            <div className="text-lg">Loading blogs...</div>
          </div>
        </Layout>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Blog</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest news, trends, and insights from the world of technology and e-commerce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length > 0 ? blogs.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={post.image || "https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Blog+Image"} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3 hover:text-blue-600 cursor-pointer">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {post.content}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-gray-500">
                No blog posts available.
              </div>
            )}
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

export default Blog;