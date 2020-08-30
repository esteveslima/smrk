const { Model, DataTypes } = require('sequelize');

class comment extends Model {
  static init(connection) {
    super.init({
      text: DataTypes.STRING,
    }, {
      sequelize: connection,
    });
  }

  static associate(models) {
    this.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
  }
}

module.exports = comment;
