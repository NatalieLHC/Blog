import { Model, DataTypes } from 'sequelize';
// Blog model definition
export default (sequelize) => {
    class Blog extends Model {
        static associate(models) {
            // Define associations here
            Blog.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments' });
        }
    }

    Blog.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'Blog',
        }
    );

    return Blog;
};
