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

export const AuthController = {
  getLoggedInUser,
};
