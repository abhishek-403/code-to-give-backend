import { Request, Response } from "express";
import { errorResponse, successResponse } from "../lib/responseWrappper";
import User, { IUser } from "../model/user.schema";
import { UserDto } from "../dto/user.dto";

export const googleLogin = async (req: any, res: Response) => {
  try {
    const uid = req.user?.uid as string;
    const { email, name }: Partial<UserDto> = req.body;
    if (!email || !uid) {
      res.send(errorResponse(400, "Bad Request"));
      return;
    }
    const existingUser: IUser | null = await User.findOne({ uid });

    if (existingUser) {
      res.send(successResponse(200, { user: existingUser }));
      return;
    }

    const newUser: IUser = new User({
      uid,
      email,
      name,
      profileImage: req.body.profileImage,
      authProvider: "google",
    });

    await newUser.save();

    res.send(successResponse(200, { user: newUser }));
    return;
  } catch (error) {
    console.error(error);
    res.send(errorResponse(500, "Internal Server Error"));
    return;
  }
};
