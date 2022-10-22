const { mongo, default: mongoose } = require("mongoose");
const Messages = require("../models/messageModel");

const Message = Messages.messageSchema;
const Conversation = Messages.conversationModel;

const ObjectId = mongoose.Types.ObjectId;

exports.getConversations = async (req, res, next) => {
  const conversations = await Conversation.find();
  if (!conversations)
    return res.send({
      type: "Error",
      message: "Something went wrong",
    });
  res.send(conversations);
};

exports.findOrCreateConversation = async (req, res, next) => {
  const { participants } = req.body;

  if (!participants)
    return res.status(400).send({
      type: "Error",
      message: "Invalid participant",
    });

  if (!Array.isArray(participants))
    return res.status(400).send({
      type: "Error",
      message: "Invalid type of participants",
    });

  if (participants.length < 2)
    return res.status(400).send({
      type: "Error",
      message: "Not enough participants",
    });

  const oldConversation = await Conversation.findOne({
    participants: { $all: participants },
  }).populate("participants");

  if (oldConversation) return res.send(oldConversation);

  const newConversation = await Conversation.create({
    participants: [...participants],
    message: [],
  });

  return res.status(201).send(newConversation);
};

exports.newMessage = async (req, res, next) => {
  const { id, message } = req.body;

  if (!id || !message || !ObjectId.isValid(id))
    return res.status(400).send({
      type: "Error",
      message: "Invalid message format",
    });

  const conversation = await Conversation.findOne({ _id: id });
  if (!conversation)
    return res.status(400).send({
      type: "Error",
      message: "Conversation doesn't exist",
    });

  const senderId = message.from;
  if (!ObjectId.isValid(senderId))
    return res.status(400).send({
      type: "Error",
      message: "The sender id is not valid",
    });

  const createdMessage = await Message.create({
    from: senderId,
    text: message.text ? message.text : "",
    imageUrl: message.imageUrl ? message.imageUrl : "",
  });

  Conversation.updateOne(
    { _id: id },
    {
      $push: { messages: createdMessage },
    },
    (error, success) => {
      if (error)
        res.send({
          type: "Error",
          message: "Something went wrong",
        });
      else {
        Message.deleteOne({ _id: createdMessage._id }, (error, done) => {
          if (error)
            res.status(400).send({
              type: "Error",
              message: "Something went wrong",
            });
          else {
            res.status(201).send({
              type: "Success",
              message: "Message created",
              data: success,
            });
          }
        });
      }
    }
  );
};

exports.getRecentsConversations = async (req, res) => {
  const { id } = req.query;
  if (!id || !ObjectId.isValid(id))
    return res.status(400).send({
      type: "Error",
      message: "The request querries must contain a valid id",
    });

  const recents = await Conversation.find({
    participants: { $in: id },
  })
    .populate("participants")
    .sort({ updatedAt: "desc" });

  res.send(recents);
};
