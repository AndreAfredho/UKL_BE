const express=require('express')
const app=express()
app.use(express.json())
const foodController=require("../controllers/food.controller")
const adminController=require("../controllers/admin.controller")

app.get("/",foodController.getAllFood)
app.get("/:key",foodController.findMakanan)
app.post("/",foodController.addFood)
app.put("/:id",foodController.updateMakanan)
app.delete("/:id",adminController.authorize,foodController.deleteFood)
module.exports=app