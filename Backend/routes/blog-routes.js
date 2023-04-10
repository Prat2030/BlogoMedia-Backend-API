import express from "express";
import { createBlog, getAllBlogs, getById, updateBlog } from "../controllers/blog-controller";
const blogRouter = express.Router();

blogRouter.get("/",getAllBlogs);
blogRouter.post("/add",createBlog);
blogRouter.put("/update/:id",updateBlog);
blogRouter.get("/get/:id",getById);

export default blogRouter;