const express = require('express')
const {protect} = require("../middleware/authMiddleware");
const {accessChats,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} = require("../controllers/chatControllers")
const router = express.Router();

 router.route('/').post(protect,accessChats);      //for accessing the chat or creating the chat
 router.route('/').get(protect,fetchChats);        //get all the chats from the database for that particular user
 router.route("/group").post(protect , createGroupChat)
 router.route("/rename").put(protect , renameGroup)
 router.route("/groupremove").put(protect , removeFromGroup)
 router.route("/groupadd").put(protect , addToGroup)

module.exports= router;