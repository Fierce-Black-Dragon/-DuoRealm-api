import express from "express";
import auth from "./auth"
import user from "./user"
import chat from "./chat"
import messages from './message'
const router = express.Router();
router.use('/auth', auth)
router.use('/user',user)
router.use('/chats',chat)
router.use('/messages',messages)

export default router;
