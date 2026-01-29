import { Router } from "express";
import authMiddileware, { UserRole } from "../../middlewares/authMiddleware";
import { SellerManagementController } from "./sellerManagement.controller";

const router = Router();

router.get(
  "/orders",
  authMiddileware(UserRole.SELLER),
  SellerManagementController.getSellerOrders,
);

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

router.patch(
  "/orders/:id",
  authMiddileware(UserRole.SELLER),
  SellerManagementController.updateOrderStatus,
);

router.delete(
  "/medicines/:id",
  authMiddileware(UserRole.SELLER),
  SellerManagementController.deleteMedicine,
);

export const SellerManagementRouter = router;
