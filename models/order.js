'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.detail, {foreignKey: `orderID`})
    }
  }
  order.init({
    orderID: {
        allowNull : false,
        autoIncrement: true,
        primaryKey : true,
        type : DataTypes.INTEGER
      },
    customerName: DataTypes.STRING,
    tableName: DataTypes.STRING,
    orderDate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};