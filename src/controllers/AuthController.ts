import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/User";
import cookieGenerator from "../utils/cookieGenerator";
import filterObj from "../utils/filterReqData";

const handleLogin = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    console.log("first", !email || !username);
    if ((!email && !username) || !password)
        return res.status(400).json({
            success: false,
            message: " All feilds  are required",
        });

    const filteredBody = filterObj(req.body, "password", "username", "email");

    let foundUser = await User.findOne({ $or: [{ email: filteredBody?.username }, { username: filteredBody?.email }] })

        .select("+password")
        .exec();

    // if (email)
    // =usergiveType
    if (!foundUser) return res.sendStatus(401); //Unauthorized
    // evaluate password
    const isPasswordCorrect = await foundUser?.verifyPassword(
        filteredBody?.password
    );
    if (isPasswordCorrect) {
        cookieGenerator(foundUser, res, "Login Successful");
    } else {
        res.status(401).json({
            success: false,
            message: " Unauthorise request",
        });
    }
};

const handleSignup = async (req: Request, res: Response) => {
    try {
        const { email, password, lastName, firstName, username } = req.body;

        if (!email || !password || !lastName || !firstName) {
            res.status(400).json({
                success: false,
                message: " All feilds  are required",
            });
        } //finding if user is already register

        const filteredBody = filterObj(
            req.body,
            "firstName",
            "lastName",
            "email",
            "password",
            "username"
        );
        if (!filteredBody["username"]) {
            filteredBody["username"] = filteredBody.email;
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            res.status(403).json({
                success: false,
                message: `${existingUser.email} is already been registered`,
            });
        }
        //creating user in mongo db
        const user = new User(filteredBody);
        await user.save();
        console.log(user,"===========2")
        //token creation function
        cookieGenerator(user, res, "Register Succesfully");
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
};

const handleRefreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.token) {
       res.status(401).json({
            success: false,
            message: "Unauthorise user",
            });
            
    } 
    const refreshToken = cookies.token;
    res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });

    // const foundUser = await User.findOne({ refreshToken }).exec();

    // // Detected refresh token reuse!
    // if (!foundUser) {
    //     jwt.verify(
    //         refreshToken,
    //         process.env.REFRESH_TOKEN_SECRET,
    //         async (err, decoded) => {
    //             if (err) return res.sendStatus(403); //Forbidden
    //             console.log('attempted refresh token reuse!')
    //             const hackedUser = await User.findOne({ username: decoded.username }).exec();
    //             hackedUser.refreshToken = [];
    //             const result = await hackedUser.save();
    //             console.log(result);
    //         }
    //     )
    //     return res.sendStatus(403); //Forbidden
    // }

    // evaluate jwt:obj
    jwt.verify(
        refreshToken,
        process.env.REFRESH_KEY as Secret,
        async (err: any, decode: any) => {
            if (err) {
                console.log("expired refresh token");
            }

            const id = new mongoose.Types.ObjectId(decode.id);

            const user = await User.findById(id);

            cookieGenerator(user, res, "Re-login  Success");
        }
    );
};

const handleLogout = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.token) return res.sendStatus(401);
    const refreshToken = cookies.token;
    res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });

    res.status(200).json({
        success: true,
        message: ` Logout succesfully`,
    });
};

export { handleLogin, handleSignup, handleRefreshToken, handleLogout };
