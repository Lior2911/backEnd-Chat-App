const asyncHandler = require("express-async-handler");
const MessageModel = require('../models/Message')
const User = require('../models/User')
const Chat = require('../models/Chat')

const sendMessage = asyncHandler(async (req,res)=>{
  const {content , chatId}= req.body;

  if(!content || !chatId){
    console.log("invalid data passed through request")
    return res.status(400)
  }
  let newMessage = {
    sender : req.user._id,
    content:content,
    chat:chatId
  };
  try {
  
    let message = await  MessageModel.create(newMessage)
    message = await message.populate("sender","name pic")
    message = await message.populate("chat")
    message = await User.populate(message,{
      path:'chat.users',
      select:'name pic email'
    })
    await Chat.findByIdAndUpdate(req.body.chatId,{
      lastMessage:message,

    })
    res.json(message)
  } catch (error) {
    res.status(400).json({error})
    
  }

})
const allMessage = asyncHandler((req,res)=>{
  try {
    const messages = await MessageModel.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat")

    res.json(messages)
  } catch (error) {
    res.status(400).json({error})
    
  }
})
module.exports = {sendMessage,allMessage}