import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getById, updateBlog } from "../controllers/blog-controller";
const blogRouter = express.Router();

blogRouter.get("/",getAllBlogs);
blogRouter.post("/add",createBlog);
blogRouter.put("/update/:id",updateBlog);
blogRouter.get("/get/:id",getById);
blogRouter.delete("/:id",deleteBlog);

export default blogRouter;