import { Request, Response } from "express";
import { OrderService } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
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
    res.status(500).json({
      success: false,
      message: error || "Failed to create Order",
    });
  }
};

const getUserOrders = async (req: Request, res: Response) => {
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
    console.error("Error in getUserOrders:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch Order",
    });
  }
};

const getOrderDetails = async (req: Request, res: Response) => {
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
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch Order",
    });
  }
};

export const OrderController = {
  createOrder,
  getUserOrders,
  getOrderDetails,
};
