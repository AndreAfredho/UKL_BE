'use strict';
const {
  Model
} = require('sequelize');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');
module.exports = (sequelize, DataTypes) => {
  class food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.hasOne(models.detail,{foreignKey:"food_id"})
      // define association here
    }
  }
  food.init({
foodID: {
  allowNull : false,
  autoIncrement: true,
  primaryKey : true,
  type : DataTypes.INTEGER
},
    name: DataTypes.STRING,
    spicyLevel: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'food',
  });

  

  return food;
};