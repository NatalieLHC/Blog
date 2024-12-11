import { Sequelize, DataTypes } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Dynamically import the JSON configuration
const config = await import('../config/config.json', {
  assert: { type: 'json' },
});

// Access the environment configuration (e.g., development, production)
const env = process.env.NODE_ENV || 'development';
const currentConfig = config.default[env];

// Get the current file's directory (similar to __dirname)
const __filename = fileURLToPath(import.meta.url);  // Get the current file's full path
const __dirname = path.dirname(__filename);          // Get the current file's directory

const db = {};

let sequelize;
if (currentConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[currentConfig.use_env_variable], currentConfig);
} else {
  sequelize = new Sequelize(
      currentConfig.database,
      currentConfig.username,
      currentConfig.password,
      currentConfig
  );
}

// Initialize models manually, in a controlled order
import User from './user.js';
import Blog from './blog.js';
import Comment from './comment.js';

// Initialize the models
db.User = User(sequelize);
db.Blog = Blog(sequelize);
db.Comment = Comment(sequelize);

// Setup associations (ensure models are initialized first)
db.User.associate(db);
db.Blog.associate(db);
db.Comment.associate(db);

// Add sequelize and Sequelize to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
export { User };
export { Blog };
export { Comment };
