const foodModel = require('../models/index').food
const md5 = require('md5')
const where = require("sequelize")
const Op = require("sequelize").Op
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require("fs")
const upload = require('./upload-image').single('image')


exports.getAllFood = async (req, res) => {
    let foods = await foodModel.findAll()
    return res.json({
        success: true,
        data: foods,
        message: 'All events have been loaded'
    })
}
exports.findMakanan = async (request, response) => {
    try {
        /** define keyword to find data */
        let keyword = request.params.key

        let makanans = await foodModel.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.substring]: keyword } },
                    { spicyLevel: { [Op.substring]: keyword } },
                    { price: { [Op.substring]: keyword } }
                ]
            }
        })
        return response.json({
            success: true,
            data: makanans,
            message: 'All Makanans have been loaded'
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }

}
// exports.findFood=async(req,res)=>{
//     let keyword=req.params.key

//     let users=await userModel.findAll({
//         where:{
//             [Op.or]: [
//                 { userID: { [Op.substring]: keyword } },
//                 { firstname: { [Op.substring]: keyword } },
//                 { lastname: { [Op.substring]: keyword } },
//                 { email: { [Op.substring]: keyword } },
//                 { role: { [Op.substring]: keyword } }
//             ]               
//         }
//     })
//     return res.json({
//         success: true,
//         data: users,
//         message: 'All users have been loaded'
//     })
// }
exports.addFood = (req, res) => {
    upload(req, res, error => {
        if (error) {
            return res.json({ message: error })
        }
        // if (!req.file) {
        //     return res.json({ message: 'Nothing to upload' })
        // }
        let newFood = {
            name: req.body.name,
            spicyLevel: req.body.spicyLevel,
            price: req.body.price,
            image: null
        }

        if(req.file){
            newFood.image = req.file.filename
        }
        foodModel.create(newFood)
            .then(result => {
                return res.json({
                    success: true,
                    data: result,
                    message: 'New food has been inserted'
                })
            })
            .catch(error => {
                return res.json({
                    success: false,
                    message: error.message
                })
            })
    })
}
exports.updateMakanan = async (request, response) => {
    /** run upload function */
    upload(request, response, async error => {
        /** check if there are error when upload */
        if (error) {
            return response.json({ message: error })
        }
        /** store selected makanan ID that will update */
        let foodID = request.params.id
        const selectedMakanan = await foodModel.findOne({
            where: { foodID: foodID }
        })

        if (!selectedMakanan) {
            return response.json({
                success: false,
                message: "Makanan ID tidak ada!"
            })
        }
        /** prepare makanan's data that will update */
        let dataMakanan = {
            name: request.body.name,
            spicyLevel: request.body.spicyLevel,
            price: request.body.price
        }
        /** check if file is not empty,
        * it means update data within reupload file
        */
        if (request.file) {
            /** get old filename of image file */
            const oldImage = selectedMakanan.image
            /** prepare path of old image to delete file */
            const pathImage = path.join(__dirname, `../image`, oldImage)
            /** check file existence */
            if (fs.existsSync(pathImage)) {
                /** delete old image file */
                //path = lokasi file
                fs.unlink(pathImage, error => console.log(error))
            }
            /** add new image filename to makanan object */
            dataMakanan.image = request.file.filename
        }
        /** execute update data based on defined id makanan */
        foodModel.update(dataMakanan, {
            where: {
                foodID: foodID
            }
        }).then(result => {
                /** if update's process success */
                return response.json({
                    success: true,
                    message: `Data makanan has been updated`
                })
            }).catch(error => {
                /** if update's process fail */
                return response.json({
                    success: false,
                    message: error.message
                })
            })
    })
}

exports.deleteFood = async (req, res) => {
    const foodID = req.params.id
    const food = await foodModel.findOne({ where: { foodID: foodID } })
    const oldImage = food.image
    const pathImage = path.join(__dirname, '../image/', oldImage)
    if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, error => console.log(error))
    }
    foodModel.destroy({ where: { foodID: foodID } })
        .then(result => {
            return res.json({
                success: true,
                message: 'Data event has been deleted'
            })
        })
        .catch(error => {
            return res.json({
                success: false,
                message: error.message
            })
        })
}