import express from "express";
import {
    handleLogin,
    handleSignup,
    handleRefreshToken,
    handleLogout,
    validateUserNameOREmail
} from "../controllers/AuthController";

const router = express.Router();
router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.get("/validate/:query",validateUserNameOREmail)
router.get("/refresh", handleRefreshToken);
router.get("/logout", handleLogout);


export default router;
