import express from "express";
import auth from "./auth"
import user from "./user"
import chat from "./chat"
const router = express.Router();
router.use('/auth', auth)
router.use('/user',user)
router.use('/chats',chat)
export default router;
