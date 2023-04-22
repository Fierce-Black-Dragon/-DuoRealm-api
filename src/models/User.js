"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        maxlength: [30, " max 40 character"],
    },
    firstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
    },
    avatar: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: function (email) {
                return String(email)
                    .toLowerCase()
                    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            },
            message: (props) => `Email (${props.value}) is invalid!`,
        },
    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
        minlength: [6, "Please enter password greater than or equal to 6 char"],
        select: false,
    },
    friends: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    guilds: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Guild",
        },
    ],
    status: {
        type: String,
        default: "offline",
    },
    // more fields will be added when required
}, {
    timestamps: true,
});
//encrypt password before save -- mongoose Hook
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        //to prevent over-encryption of password
        if (!this.isModified("password")) {
            return next();
        }
        //encrypt
        this.password = yield bcrypt_1.default.hash(this.password, 10);
    });
});
// Mongoose Methods
//user password validate method
userSchema.methods.verifyPassword = function (senderPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(senderPassword, "senderPassword", this.password);
        const isValid = yield bcrypt_1.default.compare(senderPassword, this.password);
        return isValid;
    });
};
// jwt Access Token  creation
userSchema.methods.jwtAccessTokenCreation = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let token = jsonwebtoken_1.default.sign({ id: this._id }, process.env.ACCESS_KEY, {
            expiresIn: process.env.JWT_ACCESS_EXPIRE,
        });
        return token;
    });
};
// jwt tRefresh Token  creation
userSchema.methods.jwtRefreshTokenCreation = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({ id: this._id }, process.env.REFRESH_KEY, {
            expiresIn: process.env.JWT_REFRESH_EXPIRE,
        });
    });
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
