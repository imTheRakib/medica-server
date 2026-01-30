import { Router } from "express";
import authMiddileware from "../../middlewares/authMiddleware";
import { AdminController } from "./admin.controller";
import { UserRole } from "../../types/enums/UserRoles";

const router = Router();

router.get(
  "/users",
  authMiddileware(UserRole.ADMIN),
  AdminController.getAllUsers,
);

router.get(
  "/getAllTableStats",
  authMiddileware(UserRole.ADMIN),
  AdminController.getAllTableStats,
);

router.patch(
  "/users/:id",
  authMiddileware(UserRole.ADMIN),
  AdminController.updateUserStatus,
);

export const AdminRouter = router;
