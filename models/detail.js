'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.food,{foreignKey:"foodID"})
      this.belongsTo(models.order,{foreignKey:"orders"})
      // define association here
    }
  }
  detail.init({

    detailID: {
      allowNull : false,
      autoIncrement: true,
      primaryKey : true,
      type : DataTypes.INTEGER
    },

    orderID: DataTypes.INTEGER,
    foodID: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'detail',
  });
  return detail;
};