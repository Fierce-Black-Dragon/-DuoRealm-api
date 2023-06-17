import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/User";
import cookieGenerator from "../utils/cookieGenerator";
import filterObj from "../utils/filterReqData";

const handleLogin = async (req: Request, res: Response) => {
  const { userCred, password } = req.body;
  if ((!userCred) || !password) {

    return res.status(400).json({
      success: false,
      message: " All feilds  are required",
    });
  }
  const filteredBody = filterObj(req.body, "password", "userCred");

  let foundUser = await User.findOne({
    $or: [{ email: filteredBody?.userCred }, { username: filteredBody?.userCred }],
  })

    .select("+password")
    .exec();
  // if (email)
  // =usergiveType
  if (!foundUser)
    return res.status(401).json({
      success: false,
      message: 'no use found ',
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
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Check if the user already exists
    const existingUser = await User.findOne(
      { $or: [{ email }, { username }] },
      { email: 1, username: 1 }
    );
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          success: false,
          message: `${existingUser.email} is already registered`,
        });
      } else if (existingUser.username === username) {
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
    const user = new User(filteredBody);
    await user.save();

    // Token creation function
    cookieGenerator(user, res, "Registered Successfully");

    // Return success response
    return res.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error:any) {
    return res.status(500).json({
      success: false,
      message: error.message,
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
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_KEY as Secret
    );
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

const validateUserNameOREmail = async (req: Request, res: Response) => {
  const { query } = req.params;
  console.log(query);
  let alreadyExist = await User.findOne({
    $or: [{ email: query }, { username: query }],
  });
  if (alreadyExist) return res.status(200).send(true);
  res.status(200).send(false);
};

export {
  handleLogin,
  handleSignup,
  handleRefreshToken,
  handleLogout,
  validateUserNameOREmail,
};
