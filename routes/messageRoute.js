const express = require("express");
const messageCtrl = require("../controllers/messageController");
const messageRouter = express.Router();

messageRouter.get("/", messageCtrl.getConversations);
messageRouter.post("/discuss", messageCtrl.findOrCreateConversation);
messageRouter.post("/send", messageCtrl.newMessage);
messageRouter.get("/recent", messageCtrl.getRecentsConversations);

module.exports = messageRouter;
