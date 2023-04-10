import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image :{
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User", // This is the name of the model
        required: true
    },
});

export default mongoose.model("Blog", blogSchema);