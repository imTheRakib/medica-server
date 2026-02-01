import { Router } from "express";
import { AuthController } from "./auth.controller";
import authMiddileware from "../../middlewares/authMiddleware";
import { UserRole } from "../../types/enums/UserRoles";

const router = Router();

router.get(
  "/me",
  authMiddileware(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  AuthController.getLoggedInUser,
);

router.patch(
  "/update",
  authMiddileware(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  AuthController.updateProfile,
);

export const AuthRouter = router;
