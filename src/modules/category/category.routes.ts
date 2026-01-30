import { Router } from "express";
import authMiddileware from "../../middlewares/authMiddleware";
import { CategoryController } from "./category.controller";
import { UserRole } from "../../types/enums/UserRoles";

const router = Router();

router.get("/", CategoryController.getAllCategories);

router.post(
  "/",
  authMiddileware(UserRole.ADMIN),
  CategoryController.createCategory,
);

export const CategoryRouter = router;
