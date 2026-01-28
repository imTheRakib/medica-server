import { Router } from "express";
import authMiddileware, { UserRole } from "../../middlewares/authMiddleware";
import { SellerManagementController } from "./sellerManagement.controller";

const router = Router();

router.post(
  "/medicines",
  authMiddileware(UserRole.SELLER),
  SellerManagementController.createMedicine,
);

router.put(
  "/medicines/:id",
  authMiddileware(UserRole.SELLER),
  SellerManagementController.updateMedicine,
);

router.delete(
  "/medicines/:id",
  authMiddileware(UserRole.SELLER),
  SellerManagementController.deleteMedicine,
);

export const SellerManagementRouter = router;
