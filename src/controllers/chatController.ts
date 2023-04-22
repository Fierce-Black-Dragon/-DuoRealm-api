import { Request, Response } from "express";
import Chat from "../models/Chat";
import PesonalMessage from "../models/Message";
const createPersonalChat = async (req: any, res: Response) => {
  try {
    const { reciever } = req.body;

    const currentuser = req.user.id;
    const members = [reciever, currentuser];
    // check if there is an existing chat document with the same members
    const existingChat = await Chat.findOne({ members: { $all: members } });

    if (existingChat) {
      return res.status(200).json({
        success: true,
        message: "chatfound",
        existingChat,
      });
    }

    const chat = await Chat.create({ members });
    res.status(200).json({
      success: true,
      message: "chat created",
      chat,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ sucess: false, error: "Server error" });
  }
};

const getUserChats = async (req: any, res: Response) => {
  try {
    const currentuser = req.user.id;
    const existingChats = await Chat.find({ members: { $in: [currentuser] } });
    if (existingChats.length === 0) {
      res.status(200).json({
        success: true,
        message: "No chats",
        existingChats: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "All chats",
      existingChats,
    });
  } catch (error) {
    res.status(500).json({ sucess: false, error: "Server error" });
  }
};

const getUserChatByID = async (req: any, res: Response) => {
  try {
    const chatId = req.params.id;
    const existingChat = await Chat.findById(chatId);
    if (!existingChat) {
      res.status(404).json({
        success: false,
        message: "No chat found",
      });
    }
    res.status(200).json({
      success: true,
      message: "chat found",
      existingChat,
    });
  } catch (error) {
    res.status(500).json({ sucess: false, error: "Server error" });
  }
};
const addMessage = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { sender, content, type } = req.body;

  try {
    const personalChatMessenger = await PesonalMessage.findOne({chatId:chatId});

    // PersonalChat.findByIdAndUpdate(chatId, {
    //   $push: { messages: { sender, content } }
    // });
    if (!personalChatMessenger) {
      return res
        .status(404)
        .json({ error: "Messages not found for this chat" });
    }

    // res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
export { createPersonalChat };
