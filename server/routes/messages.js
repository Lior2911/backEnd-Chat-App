const router = require('express').Router()
const {allMessage,sendMessage } = require('../controller/messages')
const {protect} = require('../middleWares/auth')
// getUsers
router.route('/').post(protect,sendMessage)
router.route('/chatId').get(protect,allMessage)





module.exports= router