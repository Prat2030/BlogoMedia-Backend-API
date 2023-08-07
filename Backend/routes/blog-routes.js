import express from "express";
import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getById,
  getByUserId,
  updateBlog,
  likeBlog,
  commentBlog,
} from "../controllers/blog-controller";
  const blogRouter = express.Router();


blogRouter.get("/",getAllBlogs);
blogRouter.post("/add",createBlog);
blogRouter.put("/update/:id",updateBlog);
blogRouter.get("/get/:id",getById);
blogRouter.delete("/:id",deleteBlog);
blogRouter.get("/user/:id",getByUserId);
blogRouter.put("/like/:id", likeBlog); // Route to like a blog
blogRouter.put("/comment/:id", commentBlog); // Route to add comment to a blog

export default blogRouter;