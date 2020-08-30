const { Model, DataTypes } = require('sequelize');

class user extends Model {
  static init(connection) {
    super.init({
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
    }, {
      sequelize: connection,
    });
  }

  static associate(models) {
    this.hasMany(models.comment, { foreignKey: 'userId', as: 'comments' });
  }
}

module.exports = user;
