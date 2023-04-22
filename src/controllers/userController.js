"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggedInUser = exports.fetchUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const fetchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        const keyword = search
            ? {
                $or: [
                    { username: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            }
            : {};
        const users = yield User_1.default.find(Object.assign(Object.assign({}, keyword), { _id: { $ne: req.user._id } }));
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No user found with the search term "${search}"`,
            });
        }
        res.status(200).json({
            success: true,
            data: { users },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
});
exports.fetchUsers = fetchUsers;
const loggedInUser = (req, res) => {
    const { user } = req;
    if (user) {
        res.status(200).json({
            success: true,
            data: { user },
        });
    }
    else {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};
exports.loggedInUser = loggedInUser;
