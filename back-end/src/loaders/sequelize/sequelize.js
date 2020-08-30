const Sequelize = require('sequelize');
const dbConfig = require('./database');

const User = require('../../database/models/User');
const Comment = require('../../database/models/Comment');

exports.setupSequelize = () => {
  const sequelize = new Sequelize(dbConfig);

  sequelize.sync();

  User.init(sequelize);
  Comment.init(sequelize);

  User.associate(sequelize.models);
  Comment.associate(sequelize.models);
};
