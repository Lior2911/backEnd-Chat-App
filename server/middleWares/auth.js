const jwt = require('jsonwebtoken');
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async(req,res,next)=>{
  let token;

  if(
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try{
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token ,process.env.SECRET_KEY);
      
      req.user = await User.findById(decoded.id).select("-password");
      next()
    }
    catch(err){
      res.status(401);
    
    }
  }
  if(!token){
    res.status(404).json({message:"not authorized, token not valid"})
  }

})

module.exports = {protect}