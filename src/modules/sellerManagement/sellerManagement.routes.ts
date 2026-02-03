import { Router } from "express";
import authMiddileware from "../../middlewares/authMiddleware";
import { SellerManagementController } from "./sellerManagement.controller";
import { upload } from "../../config/upload";
import { UserRole } from "../../types/enums/UserRoles";

const router = Router();

router.get(
  "/orders",
  authMiddileware(UserRole.SELLER),
  SellerManagementController.getSellerOrders,
);
router.get(
  "/medicines",
  authMiddileware(UserRole.SELLER),
  SellerManagementController.getSellerMedicines,
);

router.get(
  "/statistics",
  authMiddileware(UserRole.SELLER),
  SellerManagementController.getSellerStats,
);

router.post(
  "/medicines",
  authMiddileware(UserRole.SELLER),
  upload.single("thumbnail"),
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
