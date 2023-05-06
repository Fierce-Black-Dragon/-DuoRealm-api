
import express from "express";
import { createPersonalChat } from "../controllers/chatController";


import verifyJWT from "../middlewares/verifyAuth";

const router = express.Router();

router.route("/create").post(verifyJWT,createPersonalChat );




export default router;
