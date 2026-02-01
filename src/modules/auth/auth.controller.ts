import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";

const getLoggedInUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("You are not authorized");
    }

    const result = await AuthService.getLoggedInUser(user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { name, phone } = req.body;

    if (!user) {
      throw new Error("You are not authorized");
    }

    // ar one field need to provid
    if (!name && !phone) {
      throw new Error("At least one field (name or phone) is required");
    }

    const result = await AuthService.updateProfile(user.id, { name, phone });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const AuthController = {
  getLoggedInUser,
  updateProfile,
};
