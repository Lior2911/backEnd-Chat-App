const dotenv = require('dotenv');
dotenv.config()
const DB = require('./DB');
const PORT = process.env.PORT
const cors = require("cors")
const express = require("express");
const chatRouter = require('./routes/chat')
const userRouter = require('./routes/users')
const messageRouter = require('./routes/messages')


const app = express();

app.use(cors())
app.use(express.json({extended:true}))
app.use(express.urlencoded({extended : true}))
app.use('/chats',chatRouter)
app.use('/users',userRouter)
app.use('/messages',messageRouter)

app.get("/", (request, response) => {
  response.send({ success: true, message: "welcome" });
});



app.listen(PORT, () => {
  console.log("suck yuh madda-you Connected to port");
});
