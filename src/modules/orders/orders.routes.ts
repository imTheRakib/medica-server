import { Router } from "express";
import authMiddileware from "../../middlewares/authMiddleware";
import { OrderController } from "./orders.controller";
import { UserRole } from "../../types/enums/UserRoles";

const router = Router();

router.get(
  "/",
  authMiddileware(UserRole.CUSTOMER),
  OrderController.getUserOrders,
);

router.get(
  "/:id",
  authMiddileware(UserRole.CUSTOMER),
  OrderController.getOrderDetails,
);

router.post(
  "/",
  authMiddileware(UserRole.CUSTOMER),
  OrderController.createOrder,
);

router.patch(
  "/cancel/:id",
  authMiddileware(UserRole.CUSTOMER),
  OrderController.cancelOrder,
);

export const OrderRouter = router;
