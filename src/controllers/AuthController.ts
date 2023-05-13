import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/User";
import cookieGenerator from "../utils/cookieGenerator";
import filterObj from "../utils/filterReqData";

const handleLogin = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  if ((!email && !username) || !password) {
    console.log("first", !email || !username);
    return res.status(400).json({
      success: false,
      message: " All feilds  are required",
    });
  }
  const filteredBody = filterObj(req.body, "password", "username", "email");

  let foundUser = await User.findOne({
    $or: [{ email: filteredBody?.username }, { username: filteredBody?.email }],
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
    console.log(user, "===========2");
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
    const decoded :any= jwt.verify(refreshToken, process.env.REFRESH_KEY as Secret);
    const id = new mongoose.Types.ObjectId(decoded.id);

    const user = await User.findById(id);
    cookieGenerator(user, res, "Re-login Success");
  } catch (err:any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Refresh token has expired",
      });
    }

    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
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
