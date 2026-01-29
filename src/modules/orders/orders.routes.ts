import { Router } from "express";
import authMiddileware, { UserRole } from "../../middlewares/authMiddleware";
import { OrderController } from "./orders.controller";

const router = Router();

router.post(
  "/",
  authMiddileware(UserRole.CUSTOMER),
  OrderController.createOrder,
);

export const OrderRouter = router;

//order -> orderitems ->
