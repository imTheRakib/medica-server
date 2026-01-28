import { Router } from "express";
import { AuthController } from "./auth.controller";
import authMiddileware, { UserRole } from "../../middlewares/authMiddleware";

const router = Router();

router.get(
  "/me",
  authMiddileware(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  AuthController.getLoggedInUser,
);

export const AuthRouter = router;
