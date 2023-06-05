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
exports.validateUserNameOREmail = exports.handleLogout = exports.handleRefreshToken = exports.handleSignup = exports.handleLogin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const cookieGenerator_1 = __importDefault(require("../utils/cookieGenerator"));
const filterReqData_1 = __importDefault(require("../utils/filterReqData"));
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userCred, password } = req.body;
    if ((!userCred) || !password) {
        return res.status(400).json({
            success: false,
            message: " All feilds  are required",
        });
    }
    const filteredBody = (0, filterReqData_1.default)(req.body, "password", "userCred");
    let foundUser = yield User_1.default.findOne({
        $or: [{ email: filteredBody === null || filteredBody === void 0 ? void 0 : filteredBody.userCred }, { username: filteredBody === null || filteredBody === void 0 ? void 0 : filteredBody.userCred }],
    })
        .select("+password")
        .exec();
    // if (email)
    // =usergiveType
    if (!foundUser)
        return res.status(401).json({
            success: false,
            message: foundUser,
        }); //Unauthorized
    // evaluate password
    const isPasswordCorrect = yield (foundUser === null || foundUser === void 0 ? void 0 : foundUser.verifyPassword(filteredBody === null || filteredBody === void 0 ? void 0 : filteredBody.password));
    if (isPasswordCorrect) {
        (0, cookieGenerator_1.default)(foundUser, res, "Login Successful");
    }
    else {
        res.status(401).json({
            success: false,
            message: " Unauthorise request",
        });
    }
});
exports.handleLogin = handleLogin;
const handleSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, lastName, firstName, username } = req.body;
        if (!email || !password || !lastName || !firstName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        // Check if the user already exists
        const existingUser = yield User_1.default.findOne({ $or: [{ email }, { username }] }, { email: 1, username: 1 });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({
                    success: false,
                    message: `${existingUser.email} is already registered`,
                });
            }
            else if (existingUser.username === username) {
                return res.status(409).json({
                    success: false,
                    message: `${existingUser.username} is already taken, please choose a different username`,
                });
            }
        }
        // Assign default value for username
        const filteredBody = {
            firstName,
            lastName,
            email,
            password,
            username: username || email,
        };
        // Create user in MongoDB
        const user = new User_1.default(filteredBody);
        yield user.save();
        // Token creation function
        (0, cookieGenerator_1.default)(user, res, "Registered Successfully");
        // Return success response
        return res.json({
            success: true,
            message: "User registered successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.handleSignup = handleSignup;
const handleRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    console.log(cookies.token);
    if (!cookies.token) {
        console.log("object");
        return res.status(401).json({
            success: false,
            message: "Unauthorised user",
        });
    }
    const refreshToken = cookies.token;
    res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_KEY);
        const id = new mongoose_1.default.Types.ObjectId(decoded.id);
        const user = yield User_1.default.findById(id);
        (0, cookieGenerator_1.default)(user, res, "Re-login Success");
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Refresh token has expired",
            });
        }
        console.error(err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
});
exports.handleRefreshToken = handleRefreshToken;
const handleLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.token))
        return res.sendStatus(401);
    const refreshToken = cookies.token;
    res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
    res.status(200).json({
        success: true,
        message: ` Logout succesfully`,
    });
});
exports.handleLogout = handleLogout;
const validateUserNameOREmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.params;
    console.log(query);
    let alreadyExist = yield User_1.default.findOne({
        $or: [{ email: query }, { username: query }],
    });
    if (alreadyExist)
        return res.status(200).send(true);
    res.status(200).send(false);
});
exports.validateUserNameOREmail = validateUserNameOREmail;
