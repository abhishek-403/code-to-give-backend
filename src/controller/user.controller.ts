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

    const user = await User.findOne({ uid }).populate({
      path: "volunteeringInterests",
      model: "VolunteeringDomain",
    });

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
export const getAllUsers = async (req: any, res: Response) => {
  try {
    const { page = "1", limit = "6", city, role, searchQuery } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 6;
    const skip = (pageNumber - 1) * limitNumber;

    let query: any = {};

    if (city) query.city = city;
    if (role) query.role = role;
    if (searchQuery) {
      const sanitizedSearchQuery = searchQuery.replace(/[^a-zA-Z0-9\s]/g, "");
      const tokens = sanitizedSearchQuery
        .split(/\s+/)
        .filter((token: any) => token);

      if (tokens.length > 0) {
        query.$or = tokens.flatMap((token: any) => [
          { name: { $regex: token, $options: "i" } },
          { email: { $regex: token, $options: "i" } },
        ]);
      }
    }

    const users = await User.find(query).skip(skip).limit(limitNumber);
    const totalUsers = await User.countDocuments(query);

    res.send(
      successResponse(200, {
        users,
        pagination: {
          total: totalUsers,
          page: pageNumber,
          limit: limitNumber,
          hasMore: totalUsers > skip + users.length,
        },
      })
    );
  } catch (error) {
    console.error(error);
    res.send(errorResponse(500, "Internal server error"));
  }
};

export const changeUserRole = async (req: any, res: Response) => {
  try {
    const role = req.body.role;
    const userId = req.body.userId;
    if (!userId) {
      res.send(errorResponse(400, "Bad Request"));
      return;
    }
    await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    res.send(successResponse(200, "Role changed"));
  } catch (error) {
    res.send(errorResponse(500, "Internal Error"));
  }
};
export const updateUserProfile = async (req: any, res: Response) => {
  try {
    const userProfile = req.body;
    const uid = req.user.uid;
    if (!uid) {
      res.send(errorResponse(400, "Bad Request"));
      return;
    }
    const formatted = {
      ...userProfile,
      volunteeringInterests: userProfile.volunteeringInterests,
    };
    await User.findOneAndUpdate(
      { uid },
      { $set: formatted },
      { new: true, runValidators: true }
    );

    res.send(successResponse(200, "Profile updated"));
  } catch (error) {
    res.send(errorResponse(500, "Internal Error"));
  }
};
