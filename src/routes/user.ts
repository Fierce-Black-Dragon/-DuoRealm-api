import { loggedInUser } from './../controllers/userController';
import express from "express";
import { fetchUsers } from "../controllers/userController";

import verifyJWT from "../middlewares/verifyAuth";

const router = express.Router();

router.route("/").get(verifyJWT,fetchUsers );
router.route("/profile").get(verifyJWT,loggedInUser );



export default router;
