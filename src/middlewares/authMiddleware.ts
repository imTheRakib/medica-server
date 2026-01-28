import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  SELLER = "SELLER",
}

const authMiddileware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get the session
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      //if email not verified
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required. Please verfiy your email!",
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };

      //check role
      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resources!",
        });
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

export default authMiddileware;
