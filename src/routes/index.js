"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const chat_1 = __importDefault(require("./chat"));
const message_1 = __importDefault(require("./message"));
const router = express_1.default.Router();
router.use('/auth', auth_1.default);
router.use('/user', user_1.default);
router.use('/chats', chat_1.default);
router.use('/messages', message_1.default);
exports.default = router;
