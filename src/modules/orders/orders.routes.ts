import { Router } from "express";
import authMiddileware, { UserRole } from "../../middlewares/authMiddleware";
import { OrderController } from "./orders.controller";

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

export const OrderRouter = router;
