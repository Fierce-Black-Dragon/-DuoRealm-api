"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controllers/messageController");
const verifyAuth_1 = __importDefault(require("../middlewares/verifyAuth"));
const router = express_1.default.Router();
// Route for creating a message
router.post("/:chatID", verifyAuth_1.default, messageController_1.createMessage);
// Route for fetching messages by chatID
router.get("/:chatID", verifyAuth_1.default, messageController_1.fetchMessagesByChatID);
// Route for editing a message
router.put("/:chatID/:messageID", verifyAuth_1.default, messageController_1.editMessage);
// Route for deleting a message from a chatID using the message ID
router.delete("/:chatID/:messageID", verifyAuth_1.default, messageController_1.deleteMessage);
exports.default = router;
