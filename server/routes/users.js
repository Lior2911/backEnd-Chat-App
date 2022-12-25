const router = require('express').Router()
const { registerUser ,authUser,getAllUsers} = require('../controller/user')
const {protect} = require('../middleWares/auth')
// getUsers
router.route('/').post(registerUser)
router.get('/',protect,getAllUsers)
router.post('/login',authUser)




module.exports= router