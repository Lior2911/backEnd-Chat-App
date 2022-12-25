const Chat = require('../models/Chat')
const asyncHandler =require('express-async-handler');
const User = require('../models/User');


const accessChat = asyncHandler(async (req,res)=>{
  const {userId} = req.body;
  if(!userId){
    return res.status(400)
  }
  let isChat = await Chat.find({
    isGroupChat:false,
    $and:[
      {users:{$elemMatch:{$eq : req.user._id}}},
      {users:{$elemMatch:{$eq : userId}}}
    ]
    
   })
   .populate("users","-password")
   .populate("lastMessage")

   isChat = await User.populate(isChat,{
    path:'lastMessage.sender',
    select:'name pic email',
   })

   if(isChat.length>0){
    res.send(isChat[0])
   }else{
    let chatData = {
      chatName:"sender",
      isGroupChat:false,
    users:[req.user._id,userId]  }
    
    
    try{
      const createdChat = await Chat.create(chatData)

      const FullChat = await Chat.findOne({_id: createdChat._id})
      .populate("users","-password")

      res.status(200).send(FullChat)
    }
    catch(err){
      res.status(400).json({message:err})
    }
   }

})

const fetchChats = asyncHandler(async (req,res)=>{
  try {
    Chat.find({users:{$elemMatch :{$eq: req.user._id}}})
    .populate("users","-password")
    .populate("groupAdmin","-password")
    .populate("lastMessage")
    .sort({updateAt:-1})
    .then( async (results)=>{
      results = await User.populate(results , {
        path:"lastMessage.sender",
        select:"name pic email"
      })
      res.status(200).send(results)
    })
  } catch (error) {
    res.status(400).json({message:err})
  }

})

const createGroupChat =asyncHandler(async(req,res)=>{
  if(!req.body.users || !req.body.name){
    return res.status(400).send({message:"please fill the fields"}) 
   }
   let users = JSON.parse(req.body.users)

   if(users.length<2){
    return res.status(400).send({message:"more then 2 users are required to create groupChat"})
   }
   users.push(req.user);

   try {
    const groupChat = await Chat.create({
      chatName: req.body.name ,
      users:users,
      isGroupChat:true,
      groupAdmin:req.user
    })

    const FullGroupChat = await Chat.findOne({_id:groupChat._id})
    .populate("users","-password")
    .populate("groupAdmin","-password");

    res.status(200).json(FullGroupChat);
    
   } catch (error) {
    res.status(400).json({message:err})
   }


})

const renameGroup = asyncHandler(async (req,res)=>{
  const{chatId,chatName}=req.body;

  const updatedChat = await Chat.findByIdAndUpdate(chatId,{
    chatName:chatName
  },{
    new:true
  })
  .populate("users","-password")
  .populate("groupAdmin","-password");

  if (!updatedChat){
    res.status(400).json({message:"chat not fount"})
  }else{
    res.json(updatedChat)
  }
})

const addToGroup = asyncHandler(async(req,res)=>{
  const {chatId , userId} = req.body
 const added = await Chat.findByIdAndUpdate(chatId,
    {
      $push: {users: userId}
      
    },
    {new:true}
  )
  .populate("users","-password")
  .populate("groupAdmin","-password");

  if (!added){
    res.status(400).json({message:"chat not fount"})
  }else{
    res.json(added)
  }

})

const removeFromGroup = asyncHandler(async(req,res)=>{
  const {chatId , userId} = req.body
 const removed = await Chat.findByIdAndDelete(chatId,
    {
      $pull: {users: userId}
      
    },
    {new:true}
  )
  .populate("users","-password")
  .populate("groupAdmin","-password");

  if (!removed){
    res.status(400).json({message:"chat not fount"})
  }else{
    res.json(removed)
  }

})





module.exports = {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}