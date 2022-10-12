const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    catimage: {
      type: String,
      default:
        "https://raw.githubusercontent.com/DevRajeshSingh/ToDoExtension/master/unknown.png",
    },
    categories: {
      type: Array,
      required: false,
    },
    likes: {
      type : Number,
      default : 0
    } ,
      
          
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
