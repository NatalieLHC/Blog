import { Model, DataTypes } from 'sequelize';
// Comment model definition
export default (sequelize) => {
    class Comment extends Model {
        static associate(models) {
            // Comment belongs to a User
            Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });

            // Comment belongs to a Blog
            Comment.belongsTo(models.Blog, { foreignKey: 'post_id', as: 'blog' });
        }
    }

    Comment.init(
        {
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'post_id',
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'user_id',
            },
        },
        {
            sequelize,
            modelName: 'Comment',
        }
    );

    return Comment;
};
