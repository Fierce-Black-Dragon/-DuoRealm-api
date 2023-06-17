import { Request, Response } from "express";
import Chat from "../models/Chat";
import PersonalMessage from "../models/Message";
const createPersonalChat = async (req: any, res: Response) => {
  try {
    const { receiver } = req.body;

    // validate that receiver is provided in the request body
    if (!receiver) {
      return res
        .status(400)
        .json({ success: false, error: "Receiver is required" });
    }

    const currentuser = req.user.id;
    const members = [receiver, currentuser];
    // check if there is an existing chat document with the same members
    const existingChat = await Chat.findOne({ members: { $all: members } });

    if (existingChat) {
      return res.status(200).json({
        success: true,
        message: "chat found",
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
    const currentUserId = req.user.id;

    // find all chats where the current user is a member
    const chats = await Chat.find({ members: currentUserId }).populate(
      "members"
    );
    const filteredChats = chats.map((chat) => {
      const filteredMembers = chat.members.filter(
        (member) => member._id.toString() !== currentUserId
      );

      return {
        _id: chat._id,
        receiver: filteredMembers[0],
      };
    });

    res.status(200).json({
      success: true,
      message: "user chats",
      chats: filteredChats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
const getUserChatByID = async (req: any, res: Response) => {
  try {
    const { chatID } = req.params;
    const chat = await Chat.findById(chatID).populate(
      "members"
    );
    const messages = await PersonalMessage.find({ chatId: chatID })
      .populate("sender")
      .exec();
      const receiver = chat?.members.find((member)=>member.id.toString() !== req.user?._id.toString())
      console.log(receiver)
    if (!messages) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }
    let data:any = {...chat}
    data = data["_doc"]
    if (chat) {
      delete data.members;
    }
    
    return res.status(200).json({
      success: true,
      message: "messages",
      data:
        {...data,receiver,messages},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
export { createPersonalChat, getUserChats, getUserChatByID };
