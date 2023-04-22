"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPersonalChat = void 0;
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const createPersonalChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reciever } = req.body;
        const currentuser = req.user.id;
        const members = [reciever, currentuser];
        // check if there is an existing chat document with the same members
        const existingChat = yield Chat_1.default.findOne({ members: { $all: members } });
        if (existingChat) {
            return res.status(200).json({
                success: true,
                message: "chatfound",
                existingChat,
            });
        }
        const chat = yield Chat_1.default.create({ members });
        res.status(200).json({
            success: true,
            message: "chat created",
            chat,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ sucess: false, error: "Server error" });
    }
});
exports.createPersonalChat = createPersonalChat;
const getUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentuser = req.user.id;
        const existingChats = yield Chat_1.default.find({ members: { $in: [currentuser] } });
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
    }
    catch (error) {
        res.status(500).json({ sucess: false, error: "Server error" });
    }
});
const getUserChatByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatId = req.params.id;
        const existingChat = yield Chat_1.default.findById(chatId);
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
    }
    catch (error) {
        res.status(500).json({ sucess: false, error: "Server error" });
    }
});
const addMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    const { sender, content, type } = req.body;
    try {
        const personalChatMessenger = yield Message_1.default.findOne({ chatId: chatId });
        // PersonalChat.findByIdAndUpdate(chatId, {
        //   $push: { messages: { sender, content } }
        // });
        if (!personalChatMessenger) {
            return res
                .status(404)
                .json({ error: "Messages not found for this chat" });
        }
        // res.status(200).json(chat);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
