import Blog from "../model/Blog.js";
import User from "../model/User.js";

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

    let existingUser;
    try {
        existingUser = User.findById(user);
    }
    catch (err) {
        console.log(err);
    }
    if(!existingUser) {
        return res.status(404).json({message: "User not found with this Id"});
    }

    const newBlog = new Blog({
        title,
        description,
        image,
        user
    });
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({session});
        existingUser.blogs.push(newBlog);
        await existingUser.save({session});
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: err});
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
        blog = await Blog.findByIdAndRemove(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (err) {
        console.log(err);
    }
    if(!blog) {
        return res.status(404).json({message: "No blog found"});
    }
    return res.status(200).json({message: "Blog deleted successfully"});
}

export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
       userBlogs = await User.findById(userId).populate("blog");

    }
    catch (err) {
        console.log(err);
    }
    if(!userBlogs) {
        return res.status(404).json({message: "No blogs found"});
    }
    return res.status(200).json({blogs:userBlogs});
}


export const likeBlog = async (req, res, next) => {
    const blogId = req.params.id;
    let blog;
    try {
      blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      // Check if the user has already liked the blog
      const { userId } = req.body;
      if (blog.likes.includes(userId)) {
        // User already liked the blog, remove the like
        blog.likes.pull(userId);
      } else {
        // User hasn't liked the blog, add the like
        blog.likes.push(userId);
      }
  
      await blog.save();
      return res.status(200).json({ blog });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Unable to like the blog" });
    }
  };
  
  export const commentBlog = async (req, res, next) => {
    const blogId = req.params.id;
    const { userId, comment } = req.body;
  
    let blog;
    try {
      blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      blog.comments.push({ userId, comment });
      await blog.save();
      return res.status(200).json({ blog });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Unable to add comment to the blog" });
    }
  };
  