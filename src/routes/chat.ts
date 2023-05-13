
import express from "express";
import { createPersonalChat,getUserChatByID,getUserChats } from "../controllers/chatController";


import verifyJWT from "../middlewares/verifyAuth";

const router = express.Router();

router.route("/create").post(verifyJWT,createPersonalChat );
router.route("/@me").get(verifyJWT,getUserChats );
router.route('/chat/:chatID').get(verifyJWT, getUserChatByID)




export default router;
