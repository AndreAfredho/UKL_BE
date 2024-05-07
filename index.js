const express=require("express")
const bodyParser=require("body-parser")
const cors=require("cors")
const port=6000
const app=express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

const adminRoute=require("./routes/admin.route")
app.use("/admin",adminRoute)

const foodRoute=require("./routes/food.route")
app.use("/food",foodRoute)

const orderRoute=require("./routes/order.route")
app.use("/order",orderRoute)


//port
app.listen(port, () => {
    console.log(`Server of Ticket Sales run on port ${port}`)
})