import { Router } from "express";
import authMiddileware, { UserRole } from "../../middlewares/authMiddleware";
import { CategoryController } from "./category.controller";

const router = Router();

router.post(
  "/",
  authMiddileware(UserRole.ADMIN),
  CategoryController.createCategory,
);

export const CategoryRouter = router;
