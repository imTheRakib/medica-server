import { NextFunction, Request, Response } from "express";
import { OrderService } from "./order.service";
import { OrderStatus } from "../../types/enums/OrderStatus";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!orderItems || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Order items and shipping address are required",
      });
    }
    const result = await OrderService.createOrder(
      userId,
      orderItems,
      shippingAddress,
      paymentMethod,
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await OrderService.getUserOrders(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { id: orderId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await OrderService.getOrderDetails(
      orderId as string,
      userId,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: orderId } = req.params;
    const userId = req.user?.id;
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (status !== OrderStatus.CANCELLED) {
      return res.status(400).json({
        success: false,
        message: "Customers can only update order status to CANCELLED",
      });
    }

    const result = await OrderService.cancelOrder(orderId as string, userId);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const OrderController = {
  createOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
};
