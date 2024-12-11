import { Model,DataTypes, Sequelize } from 'sequelize';
export default (sequelize) => {
    class User extends Model {
        static associate(models) {
            // User has many blogs
            User.hasMany(models.Blog, { foreignKey: 'userId', as: 'blogs' });
        }
    }

    User.init(
        {
            name: DataTypes.STRING,
            password: DataTypes.STRING,
            email: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
        }
    );

    return User;
};
