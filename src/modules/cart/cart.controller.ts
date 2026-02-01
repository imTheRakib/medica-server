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

const updateCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { medicineId, quantity } = req.body;

    if (!user) {
      throw new Error("You are not authorized");
    }

    if (!medicineId || !quantity) {
      throw new Error("Medicine ID and quantity are required");
    }

    const result = await CartService.updateCart(user.id, medicineId, quantity);

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
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
    const { medicineId } = req.params;

    if (!user) {
      throw new Error("You are not authorized");
    }

    if (!medicineId) {
      throw new Error("Medicine ID is required");
    }

    const result = await CartService.removeFromCart(user.id, medicineId as string);

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
  updateCart,
  removeFromCart,
  clearCart,
};
