import  models from '../models/index.js';
import multer from 'multer';
import fs from 'fs';
import path  from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir= './uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)){
            return cb(new Error('Invalid file type'), false);
        }
        cb(null, true);
    }
}).single('imageUrl');

const uploadImage = (req, res, next) => {
    upload(req, res, (err) => {
        if (err){
            return res.status(400).json({
                message: 'Error uploading image',
                error: err.message || err
            });
        }
        next();
    });
}

const createPosts = async (req, res) => {
    const { title, content, categoryId } = req.body;
    const userId = req.user.id;
    const imageUrl = req.file ? `./uploads/${req.file.filename}` : null;

    const post = {
        title,
        content,
        imageUrl,
        categoryId,
        userId,
    }
    try {
        const result = await models.Blog.create(post);
        res.status(201).json({
            message: 'Post created successfully',
            post: result
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating post',
            post: error.message || error
        });
    }
}
//
const getPostById = async (req, res) => {
    try {
        const post = await models.Blog.findByPk(req.params.id);
        res.status(200).json({
            message: 'Post found',
            post: post
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error finding post',
            error: error.message || error
        })
    }
}
//
const getPosts = async (req, res) => {
    const { title, content, categoryId, sort = 'createdAt', order = 'DESC', page = 1 } = req.query;
    const limit = 10;  // Set number of entries per page
    const offset = (page - 1) * limit;  // Calculate the offset for pagination

    // Ensure sorting by 'createdAt' DESC by default
    const validSortFields = ['createdAt', 'updatedAt', 'title'];
    const validSortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const validOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Build the "where" condition for filtering (only if filters are provided)
    const whereCondition = buildSearchConditions(title, content, categoryId);

    try {
        // First, get the count of all posts that are not deleted
        const count = await models.Blog.count({
            where: whereCondition, // Apply filtering if any
            paranoid: false,  // Include all posts (hard-deleted or not)
        });

        // Now fetch the posts that are not deleted
        const posts = await models.Blog.findAll({
            where: {
                ...whereCondition, // Apply filtering if any
                // Additional condition to explicitly exclude deleted posts
                id: {
                    [models.Sequelize.Op.not]: null,  // Filter to only return existing posts
                }
            },
            include: [
                {
                    model: models.Comment,
                    as: 'comments',
                    attributes: ['id', 'content', 'userId', 'createdAt'],
                },
            ],
            order: [
                [validSortField, validOrder], // Sorting by specified field and order (ASC or DESC)
            ],
            limit: limit,  // Limit results per page (if pagination is used)
            offset: offset,  // Pagination offset (if pagination is used)
            paranoid: false,  // Ensures hard-deleted posts are not included
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            message: 'Posts found',
            posts: posts,  // Return the posts data
            pagination: {
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalPosts: count,  // Total count of active (non-deleted) posts
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error finding posts',
            error: error.message || error,
        });
    }
};
const buildSearchConditions = (title, content, categoryId) => {
    const where = {};

    // Case-insensitive search for title and content
    if (title) {
        where.title = {
            [models.Sequelize.Op.iLike]: `%${title}%`,  // iLike for case-insensitive search in PostgreSQL
        };
    }

    if (content) {
        where.content = {
            [models.Sequelize.Op.iLike]: `%${content}%`,  // iLike for case-insensitive search
        };
    }

    if (categoryId) {
        where.categoryId = categoryId;  // Filter by categoryId
    }

    return where;  // If no filters, this returns an empty object, and all posts are fetched
};

//
const updatePost = async (req, res) => {
    const { title, content, categoryId } = req.body;
    const imageUrl = req.file ? `./uploads/${req.file.filename}` : null;
    try {
        const post = await models.Blog.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }
        const updatedPost = await post.update({
            title,
            content,
            imageUrl: imageUrl || post.imageUrl,
            categoryId
        });
        res.status(200).json({
            message: 'Post updated successfully',
            post: updatedPost
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating post',
            error: error.message || error
        });
    }

}

//delete

const deletePost = async (req, res) => {
    try {
        const post = await models.Blog.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        await post.destroy();

        res.status(200).json({
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting post',
            error: error.message || error
        });
    }
};

export { createPosts, getPostById, getPosts, updatePost,deletePost, uploadImage };
