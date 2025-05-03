const express= require("express")
const app=express()
const dotenv=require("dotenv")
const mongoose=require("mongoose")
const cors=require("cors")
const bodyparser=require("body-parser")
const router=require("./Routers/Router")
dotenv.config()
const port=process.env.PORT||8096
app.use(cors())
app.use(bodyparser.json())
mongoose.connect(process.env.mongo_url)
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Database connection error:", err));

app.listen(port,()=>{
    console.log(`port connected on ${port}`)
})
app.use("/home", (req, res) => {
    res.json({ message: "welcome" });
});

app.use("/api", router); 