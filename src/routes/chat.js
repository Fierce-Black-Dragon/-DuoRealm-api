"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const verifyAuth_1 = __importDefault(require("../middlewares/verifyAuth"));
const router = express_1.default.Router();
router.route("/create").post(verifyAuth_1.default, chatController_1.createPersonalChat);
exports.default = router;
