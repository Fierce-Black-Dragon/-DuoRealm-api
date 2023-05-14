import { Request, Response } from "express";
import Chat from "../models/Chat";
import PersonalMessage from "../models/Message";
import User from "../models/User";
export const createMessage = async (req: any, res: Response) => {
  try {
    const { type = "Text", content } = req.body;
    const sender = req.user._id;
    const { chatID: chatId } = req.params;

    if (!sender || !content) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    const chat = await Chat.findById(chatId).populate("members");

    let message = await PersonalMessage.create({ sender, type, content, chatId });
 
    message = await message.populate("sender");
    

    res.status(200).json({
      success: true,
      data: {
     chat:{
      ...chat._doc,
      message: message 
     } 
      
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error." });
  }
};

export const fetchMessagesByChatID = async (req: any, res: Response) => {
  try {
    const { chatID } = req.params;
    const messages = await PersonalMessage.find({ chatID });
    res.status(200).json({
      success: true,
      message: "Messages fetched.",
      messages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error." });
  }
};

export const deleteMessage = async (req: any, res: Response) => {
  try {
    const { chatID, messageID } = req.params;
    await PersonalMessage.deleteOne({ _id: messageID, chatID });
    res.status(200).json({
      success: true,
      message: "Message deleted.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error." });
  }
};

export const editMessage = async (req: any, res: Response) => {
  try {
    const { chatID, messageID } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: "Content is required." });
    }

    const updatedMessage = await PersonalMessage.findOneAndUpdate(
      { _id: messageID, chatID },
      { content },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Message edited.",
      data: updatedMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error." });
  }
};
