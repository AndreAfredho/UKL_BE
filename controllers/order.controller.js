
const makananModel = require('../models/index').food
const listModel = require('../models/index').order
const detailModel = require('../models/index').detail

// const Op = require(sequelize).Op


exports.addOrder = async (request, response) => {
  try {
    const today = new Date()

    const dataOrderList = {
      customerName: request.body.customerName,
      tableName: request.body.tableName,
      orderDate: today.toString()
    }

    const newOrderList = await listModel.create(dataOrderList)

    const banyakMakanan = request.body.banyakMakanan
    /*
    [
        {
            makananID: 1,
            kuantitas: 2
        },
        {
            makananID: 2,
            kuantitas: 3
        }
    ]
    */


    for (let index = 0; index < banyakMakanan.length; index++) {
      const makananData = await makananModel.findOne({ where: { foodID: banyakMakanan[index].food_id } })
      console.log(makananData);
      if (!makananData) {
        return response.json({
          success: false,
          message: "ID makanan tidak ada di database"
        })
      }
      let newDetail = {
        foodID: makananData.foodID,
        orderID: newOrderList.orderID,
        quantity: banyakMakanan[index].quantity,
        price: makananData.price * banyakMakanan[index].quantity
      }

      await detailModel.create(newDetail)
    }

    return response.json({
      success: true,
      message: "Data inserted"
    })


  } catch (error) {
    return response.json({
      success: false,
      message: error.message
    })
  }
}

exports.showHistory = async (request, response) => {
  try {
    const jumlahData = await listModel.findAll();
    let a = [];
    for (let index = 1; index <= jumlahData.length; index++) {
      let coba = await listModel.findOne({ where: { orderID: index } });
      let coba2 = await detailModel.findAll({ where: { orderID: index } });
      a.push(coba);
      a.push(coba2);
    }

    return response.json({
      success: true,
      data: a,
    });
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};