const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    from: { type: mongoose.Types.ObjectId, ref: "Users" },
    text: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const conversationModel = mongoose.Schema({
  users: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
  message: [messageSchema],
});

exports.messageSchema = mongoose.model("Message", messageSchema);
exports.conversationModel = mongoose.model("Conversation", conversationModel);
