import Blog from "../model/Blog.js";

export const getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (err) {
        console.log(err);
    }
    if(!blogs) {
        return res.status(404).json({message: "No blogs found"});
    }
    return res.status(200).json({blogs});
}

export const createBlog = async (req, res, next) => {
    const {title, description, image,user} = req.body;
    const newBlog = new Blog({
        title,
        description,
        image,
        user
    });
    try {
        await newBlog.save();
    } catch (err) {
        console.log(err);
    }
    return res.status(201).json({newBlog});
}

export const updateBlog = async (req, res, next) => {
    const {title, description} = req.body;
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId,{
            title,
            description
        });
    } catch (err) {
        console.log(err);
    }
    if(!blog) {
        return res.status(500).json({message: "Unable to update blog"});
    }
    return res.status(200).json({blog});
}

export const getById = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findById(id);
    }
    catch (err) {
        console.log(err);
    }
    if(!blog) {
        return res.status(404).json({message: "No blog found"});
    }
    return res.status(200).json({blog});
}

export const deleteBlog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    if(!blog) {
        return res.status(404).json({message: "No blog found"});
    }
    return res.status(200).json({message: "Blog deleted successfully"});
}