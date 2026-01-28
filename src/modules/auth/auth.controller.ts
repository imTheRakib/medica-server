import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const getLoggedInUser = async (req: Request, res: Response) => {
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const AuthController = {
  getLoggedInUser,
};
