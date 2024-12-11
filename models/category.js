import { Model, DataTypes } from 'sequelize';
export default (sequelize) => {
    class Category extends Model {
        static associate(models) {
            // Category has many blogs
            Category.hasMany(models.Blog, { foreignKey: 'categoryId', as: 'blogs' });
        }
    }

    Category.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Category',
        }
    );

    return Category;
};
