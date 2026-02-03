import { Router } from "express";
import authMiddileware from "../../middlewares/authMiddleware";
import { UserRole } from "../../types/enums/UserRoles";
import { CartController } from "./cart.controller";

const router = Router();

router.get(
  "/",
  authMiddileware(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  CartController.getCartItems,
);

router.post(
  "/add",
  authMiddileware(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  CartController.addtoCart,
);

router.put(
  "/item/:cartItemId",
  authMiddileware(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  CartController.updateCartItem,
);

router.delete(
  "/item/:cartItemId",
  authMiddileware(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  CartController.removeFromCart,
);

router.delete(
  "/clear",
  authMiddileware(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  CartController.clearCart,
);

export const CartRouter = router;
