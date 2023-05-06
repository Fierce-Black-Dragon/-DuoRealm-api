import { Request, Response } from "express";
import User from "../models/User";


//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
export const fetchUsers = async (req: any, res: Response) => {
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ ...keyword, _id: { $ne: req.user._id } })
      .select("username email")
      .sort({ username: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

  
  
  export const loggedInUser = (req: Request, res: Response) => {
    const { user } = req;
    if (user) {
      res.status(200).json({
        success: true,
        data: { user },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  };
  
