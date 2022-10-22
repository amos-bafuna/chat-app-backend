const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    from: { type: mongoose.Types.ObjectId, ref: "users" },
    text: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const conversationModel = mongoose.Schema({
  participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  messages: [messageSchema],
});

exports.messageSchema = mongoose.model("Message", messageSchema);
exports.conversationModel = mongoose.model("Conversation", conversationModel);
