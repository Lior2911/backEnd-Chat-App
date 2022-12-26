const router = require('express').Router()
const { registerUser ,authUser,getAllUsers} = require('../controller/user')
const {protect} = require('../middleWares/auth')
// getUsers
router.route('/').post(protect,sendMessage)
router.route('/chatId').get(protect,allMessage)





module.exports= router