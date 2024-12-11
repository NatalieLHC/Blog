import  models from '../models/index.js';

const createComment = async (req, res) => {
    const {content, postId} = req.body;
    const userId = req.user.id;

    try{
        const post = await models.Blog.findByPk(postId);
        if (!post){
            return res.status(404).json({message: 'Post not found'});
        }
        // const user = await models.User.findByPk(userId);
        // if (!user){
        //     return res.status(404).json({message: 'User not found'});
        // }
        const comment =await models.Comment.create({
            content,
            postId,
            userId
        });
        res.status(201).json({
            message: 'Comment created successfully',
            comment: comment
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating comment',
            error: error.message || error
        });
    }
}

export {createComment};