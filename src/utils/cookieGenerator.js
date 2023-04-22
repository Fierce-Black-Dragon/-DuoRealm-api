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
Object.defineProperty(exports, "__esModule", { value: true });
const cookieGenerator = (user, res, message) => __awaiter(void 0, void 0, void 0, function* () {
    //jwt  accessToken creation
    const accessToken = yield user.jwtAccessTokenCreation();
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // Secure: true,
    };
    //refreshToken
    const refreshToken = yield user.jwtRefreshTokenCreation();
    user.password = undefined;
    //cookie creations
    res.cookie("token", refreshToken, options);
    res.status(200).json({
        success: true,
        data: {
            access_token: accessToken,
            email: user.email, isloggedin: true,
            name: user.name,
            message: message,
        },
    });
});
exports.default = cookieGenerator;
