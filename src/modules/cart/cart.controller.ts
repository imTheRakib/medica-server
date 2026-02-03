import { NextFunction, Request, Response } from "express";
import { CartService } from "./cart.service";

const getCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("You are not authorized");
    }

    const result = await CartService.getCartItems(user.id);

    res.status(200).json({
      success: true,
      message: "Cart items retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const addtoCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { medicineId, quantity = 1 } = req.body;

    if (!user) {
      throw new Error("You are not authorized");
    }

    if (!medicineId) {
      throw new Error("Medicine ID is required");
    }

    const result = await CartService.addtoCart(user.id, medicineId, quantity);

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!user) {
      throw new Error("You are not authorized");
    }

    if (!quantity) {
      throw new Error("Quantity is required");
    }

    const result = await CartService.updateCartItem(
      user.id,
      cartItemId as string,
      quantity,
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { cartItemId } = req.params;

    if (!user) {
      throw new Error("You are not authorized");
    }

    if (!cartItemId) {
      throw new Error("Medicine ID is required");
    }

    const result = await CartService.removeFromCart(
      user.id,
      cartItemId as string,
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("You are not authorized");
    }

    const result = await CartService.clearCart(user.id);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const CartController = {
  getCartItems,
  addtoCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
