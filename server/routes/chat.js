const router = require('express').Router()
const {protect} = require('../middleWares/auth')
const {accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup}=require('../controller/chat')



router.route('/').post(protect,accessChat)
router.route('/').get(protect,fetchChats)
router.route('/groupChat').post(protect,createGroupChat)
router.route('/renameGroup').put(protect,renameGroup)
router.route('/removeGroup').delete(protect,removeFromGroup)
router.route('/groupAdd').put(protect,addToGroup)


module.exports= router