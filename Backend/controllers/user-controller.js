import User from "../model/User";
import bcrypt from "bcryptjs";

export const getAllUser = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.log(err);
    }
    if(!users) {
        return res.status(404).json({message: "No users found"});
    }
    return res.status(200).json({users});
}

export const signup = async (req, res, next) => {
    const {name, email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (err) {
        return console.log(err);
    }
    if(existingUser) {
        return res.status(422).json({message: "User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    try {
        await newUser.save();
    }
    catch (err) {
        return console.log(err);
    }
    return res.status(201).json({newUser, message: "User created"});
}

export const login = async (req, res, next) => {
    const {email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (err) {
        return console.log(err);
    }
    if(!existingUser) {
        return res.status(404).json({message: "User not found"});
    }
    let isValidPassword = await bcrypt.compareSync(password, existingUser.password);
    if(!isValidPassword) {
        return res.status(401).json({message: "Incorrect Password"});
    }
    return res.status(200).json({message: "Login Successful"});
}