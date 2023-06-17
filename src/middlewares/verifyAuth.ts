import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import User from "../models/User";
interface decodeType extends JwtPayload {
  id: string;
}
const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    console.log("Authorization header is missing or in the wrong format");
    console.log(authHeader);
    return res.sendStatus(204);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_KEY as Secret
    ) as decodeType;
    const foundUser = await User.findById(decoded.id).exec();
    if (!foundUser) {
      return res.sendStatus(404);
    }

    req.user = foundUser;
    next();
  } catch (err) {
    console.log("JWT verification error:", err);
    return res.sendStatus(403);
  }
};

export default verifyJWT;
