const express=require('express')
const app=express()
app.use(express.json())
const adminController=require("../controllers/admin.controller")

app.post("/",adminController.registerAdmin)
app.post("/auth",adminController.authenticate)
module.exports=app