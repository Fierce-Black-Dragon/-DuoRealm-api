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
exports.editMessage = exports.deleteMessage = exports.fetchMessagesByChatID = exports.createMessage = void 0;
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type = "Text", content } = req.body;
        const sender = req.user._id;
        const { chatID: chatId } = req.params;
        if (!sender || !content) {
            return res.status(400).json({ success: false, error: "All fields are required." });
        }
        const chat = yield Chat_1.default.findById(chatId).populate("members");
        let message = yield Message_1.default.create({ sender, type, content, chatId });
        message = yield message.populate("sender");
        res.status(200).json({
            success: true,
            data: {
                message: message
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error." });
    }
});
exports.createMessage = createMessage;
const fetchMessagesByChatID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatID } = req.params;
        const messages = yield Message_1.default.find({ chatID });
        res.status(200).json({
            success: true,
            message: "Messages fetched.",
            messages,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error." });
    }
});
exports.fetchMessagesByChatID = fetchMessagesByChatID;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatID, messageID } = req.params;
        yield Message_1.default.deleteOne({ _id: messageID, chatID });
        res.status(200).json({
            success: true,
            message: "Message deleted.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error." });
    }
});
exports.deleteMessage = deleteMessage;
const editMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatID, messageID } = req.params;
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ success: false, error: "Content is required." });
        }
        const updatedMessage = yield Message_1.default.findOneAndUpdate({ _id: messageID, chatID }, { content }, { new: true });
        res.status(200).json({
            success: true,
            message: "Message edited.",
            data: updatedMessage,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error." });
    }
});
exports.editMessage = editMessage;
