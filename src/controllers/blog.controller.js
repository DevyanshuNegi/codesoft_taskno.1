import { User } from "../models/user.model.js"
import { Blog } from "../models/blog.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import bcrypt from "bcrypt"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ErrorSharp } from "@mui/icons-material";
import mongoose from "mongoose";


const createBlog = asyncHandler(async (req, res) => {
    /**
     * check if user logged in // done
     * get user details
     * get the details from user: 
     *      title, content, category, description, thumbnail
     * check if empty and give error
     * create new blog and save
     * get the blog from db to confirm and give error
     */

    const user = req.user;

    const { title, content, category, description, isPublished } = req.body;

    console.log(title, content, category, description, isPublished);

    var newcategory = category; // to convier string to list
    if (typeof (category) == "string") {
        newcategory = category.split(", ");
    }

    const localFilePath = req.file.path

    const isEmpty = [title, content, localFilePath].some(field => !field || field.trim() === "");
    if (isEmpty) {
        throw new ApiError(404, "title content and thumbnail is required");
    }

    const thumbnail = await uploadOnCloudinary(localFilePath)

    /**remove this code */
    var max = 700
    var min = 70
    const views = Math.floor(Math.random() * (max - min + 1)) + min;

    const blog = await Blog.create(
        {
            title: title,
            content: content,
            author: user._id,
            category: newcategory,
            description: description,
            thumbnail: thumbnail.url,
            isPublished: isPublished,
            views: views /** remove this code */
        }
    )

    // console.log(blog)

    return res
        .status(200)
        .json(
            new ApiResponse(201, blog, "Blog created successfully!!!")
        )

})

const getRandomTen = asyncHandler(async (req, res) => {
    /**
     * get list of 10-15 blogs from the db
     */

    const blogs = await Blog.aggregate([
        { $sample: { size: 10 } }
    ])

    // console.log(blogs)

    if (!blogs) {
        throw new ApiError(404, "Blogs not found ");
    }

    res.status(200)
        .json(new ApiResponse(200, blogs, "Blog responses from db"))
})

const getPopular = asyncHandler(async (req, res) => {

    const blogs = await Blog.find({})
        .sort({ views: -1 })
        .limit(1)

    if (!blogs) {
        throw new ApiError(404, "Blogs not found");
    }

    res.status(200)
        .json(new ApiResponse(200, blogs, "Blog responses from db are here "));
})

// Function to retrieve blog details by ID
const getBlogDetails = asyncHandler(async (req, res) => {
    const blogId = req.query.id;
    console.log(blogId);
    const blog = await Blog.findById(blogId);

    blog.views=blog.views+1;
    await blog.save({validateBeforeSave: false})

    

    if (!blog) {
        throw new ApiError(404, 'Blog not found'); // Handle non-existent blog
    }

    res.status(200).json(new ApiResponse(200, blog, 'Blog detail response'));
});

export { createBlog, getRandomTen, getPopular, getBlogDetails }