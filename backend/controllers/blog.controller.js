import mongoose from 'mongoose';
import Blog from '../models/Blog.model.js';
import Category from '../models/Category.model.js';
import User from '../models/User.model.js';
import cloudinary from '../config/cloudinary.js';
import getDataUri from '../config/data-uri.js';

export const createBlog = async (req, res) => {
    try {
        const {
            title,
            slug,
            excerpt,
            content,
            category,
            skillLevel,
            tags,
            author,
            featured,
            trending,
            readTime,
            isPublished,
        } = req.body;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }

        if (!mongoose.Types.ObjectId.isValid(author)) {
            return res.status(400).json({ message: 'Invalid author ID format' });
        }

        const [categoryExists, authorExists] = await Promise.all([
            Category.findById(category),
            User.findById(author),
        ]);

        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        if (!authorExists) {
            return res.status(400).json({ message: 'Invalid author ID' });
        }

        const slugExists = await Blog.findOne({ slug });
        if (slugExists) {
            return res.status(409).json({ message: 'Slug already exists' });
        }

        // Upload coverImage to Cloudinary
        let coverImageUrl = '';
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const result = await cloudinary.uploader.upload(fileUri.content, {
                folder: 'blogs',
            });
            coverImageUrl = result.secure_url;
        }

        const estimatedReadTime = readTime || Math.ceil(content.trim().split(/\s+/).length / 200);

        const newBlog = new Blog({
            title,
            slug,
            excerpt,
            content,
            coverImage: coverImageUrl,  // Store the uploaded Cloudinary URL
            category,
            skillLevel,
            tags,
            author,
            featured: featured || false,
            trending: trending || false,
            readTime: estimatedReadTime,
            isPublished: isPublished || false,
        });

        await newBlog.save();

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create blog',
            error: error.message,
        });
    }
};


// GET /api/blogs/featured
export const getFeaturedBlogs = async (req, res) => {
    try {
      // Get blogs that are featured OR trending
      const blogs = await Blog.find({ 
        $or: [{ featured: true }, { trending: true }],
        isPublished: true
      })
        .populate("author", "name avatar")   // get author info
        .populate("category", "name")        // get category name
        .sort({ publishedAt: -1 })           // newest first
        .limit(6);                           // return top 6 (optional)
  
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured blogs", error });
    }
  };
  
  // GET /api/blogs
  export const getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find({ isPublished: true })
        .populate("author", "name avatar")
        .populate("category", "title")
        .sort({ publishedAt: -1 }); // newest first
  
      res.status(200).json({
        blogs,
        total: blogs.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching blogs", error });
    }
  };