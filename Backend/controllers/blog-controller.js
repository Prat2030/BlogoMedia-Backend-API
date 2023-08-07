import Blog from "../model/Blog.js";
import User from "../model/User.js";

import nodemailer from "nodemailer";
import emailConfig from "../path/to/emailConfig.js";


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

         // Send email notification to all users when a new blog is created
        const allUsers = await User.find({}, "email");
        const to = allUsers.map((user) => user.email);
        const subject = "A new blog has been posted!";
        const text = `Check out the new blog "${newBlog.title}" by ${existingUser.name}`;
        await sendEmailNotification(to, subject, text);

        return res.status(201).json({ newBlog });


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

const transporter = nodemailer.createTransport(emailConfig);

export const sendEmailNotification = async (to, subject, text) => {
  const mailOptions = {
    from: "your_email_username",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent:", mailOptions);
  } catch (err) {
    console.log("Email sending failed:", err);
  }
};


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
  
        // Send email notification to the blog owner when someone likes their blog
        const to = blog.user.email;
        const subject = "Your blog has a new like!";
        const text = `${userId} liked your blog "${blog.title}"`;
        await sendEmailNotification(to, subject, text);
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
  
      // Send email notification to the blog owner when someone comments on their blog
      const to = blog.user.email;
      const subject = "Your blog has a new comment!";
      const text = `${userId} commented on your blog "${blog.title}": "${comment}"`;
      await sendEmailNotification(to, subject, text);
  
      await blog.save();
      return res.status(200).json({ blog });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Unable to add comment to the blog" });
    }
  };



  