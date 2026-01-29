import { Router } from "express";
import authMiddileware, { UserRole } from "../../middlewares/authMiddleware";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", authMiddileware(UserRole.ADMIN), AdminController.getAllUsers);

export const AdminRouter = router;
