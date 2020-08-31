const { Model, DataTypes } = require('sequelize');

class user extends Model {
  static init(connection) {
    super.init({
      name: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: { fields: ['email'], msg: 'This email already exists' }, // validation message not working(?)
        validate: {
          isEmail: { msg: 'Insert a valid email' },
        },
      },
    }, {
      sequelize: connection,
    });
  }

  static associate(models) {
    this.hasMany(models.comment, { foreignKey: 'userId', as: 'comments' });
  }
}

module.exports = user;
