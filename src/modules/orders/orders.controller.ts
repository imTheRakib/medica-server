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

export const OrderController = {
  createOrder,
};
