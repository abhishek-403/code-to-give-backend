import { Response } from "express";
import { CreateUserDto, IUser } from "../dto/user.dto";
import { AuthProviders } from "../lib/constants";
import { errorResponse, successResponse } from "../lib/responseWrappper";
import { User } from "../model/user.schema";

export const googleLogin = async (req: any, res: Response) => {
  try {
    const uid = req.user?.uid as string;
    const { email, displayName }: Partial<CreateUserDto> = req.body;
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
      displayName,
      profileImage: req.body.profileImage,
      authProvider: AuthProviders.GOOGLE,
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

export const createUser = async (req: any, res: Response) => {
  try {
    const uid = req.user.uid;
    if (!req.body.email || !uid || !req.body.displayName) {
      res.send(errorResponse(400, "Bad Request"));
      return;
    }

    const isUser = await User.findOne({ uid });
    if (isUser) {
      res.send(successResponse(200, { user: isUser }));
      return;
    }

    const user = new User({
      ...req.body,
      uid,
      authProvider: AuthProviders.EMAIL_PASSWORD,
    });
    await user.save();

    res.send(successResponse(200, { user }));
  } catch (error) {
    res.send(errorResponse(500, "Internal Error"));
  }
};

export const getUserById = async (req: any, res: Response) => {
  try {
    const { uid } = req.user;
    if (!uid) {
      res.send(errorResponse(400, "Uid required"));
      return;
    }

    const user = await User.findOne({ uid });

    if (!user) {
      res.send(errorResponse(404, "Not found"));
      return;
    }

    res.send(successResponse(200, user));
  } catch (error) {
    res.send(errorResponse(500, "Internal Error"));
    return;
  }
};
