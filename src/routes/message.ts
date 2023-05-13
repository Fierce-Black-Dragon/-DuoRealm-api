import express from "express";
import {
  createMessage,
  editMessage,
  fetchMessagesByChatID,
  deleteMessage,
} from "../controllers/messageController";

import verifyJWT from "../middlewares/verifyAuth";

const router = express.Router();

// Route for creating a message
router.post("/:chatID", verifyJWT, createMessage);

// Route for fetching messages by chatID
router.get("/:chatID", verifyJWT, fetchMessagesByChatID);

// Route for editing a message
router.put("/:chatID/:messageID", verifyJWT, editMessage);

// Route for deleting a message from a chatID using the message ID
router.delete("/:chatID/:messageID", verifyJWT, deleteMessage);
export default router;
