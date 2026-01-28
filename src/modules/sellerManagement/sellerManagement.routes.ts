import { Router } from "express";
import authMiddileware, { UserRole } from "../../middlewares/authMiddleware";
import { SellerManagementController } from "./sellerManagement.controller";

const router = Router();

router.post(
  "/medicines",
  authMiddileware(UserRole.SELLER),
  SellerManagementController.createMedicine,
);

export const SellerManagementRouter = router;
