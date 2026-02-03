import { NextFunction, Request, Response } from "express";
import { SellerManagementService } from "./sellerManagement.service";
import paginationAndSortgHelper from "../../helpers/paginationAndSorting";

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description, price, stocks, manufacturer, categoryId } =
      req.body;
    const imageFile = req.file;

    const medicineData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stocks: parseInt(stocks),
      manufacturer: manufacturer.trim(),
      categoryId: categoryId.trim(),
    };
    //validation
    if (medicineData.price <= 0) {
      throw new Error("Price must be a valid positive number");
    }

    if (medicineData.stocks < 0) {
      throw new Error("Stocks must be a valid positive number");
    }

    const result = await SellerManagementService.createMedicine(
      medicineData,
      req.user?.id as string,
      imageFile,
    );

    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: medicineId } = req.params;
    const user = req.user;

    const result = await SellerManagementService.updateMedicine(
      medicineId as string,
      req.body,
      user?.id as string,
    );

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: medicineId } = req.params;
    const user = req.user;

    const result = await SellerManagementService.deleteMedicine(
      medicineId as string,
      user?.id as string,
    );

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: orderId } = req.params;
    const user = req.user;
    const { status } = req.body;

    const result = await SellerManagementService.updateOrderStatus(
      orderId as string,
      status,
      user?.id as string,
    );

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSellerOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { page, limit, skip } = paginationAndSortgHelper(req.query);

    const result = await SellerManagementService.getSellerOrders(sellerId, {
      page,
      limit,
      skip,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSellerStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await SellerManagementService.getSellerStats(sellerId);

    res.status(200).json({
      success: true,
      message: "Seller stats retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSellerMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { page, limit, skip } = paginationAndSortgHelper(req.query);

    const result = await SellerManagementService.getSellerMedicines(sellerId, {
      page,
      limit,
      skip,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const SellerManagementController = {
  createMedicine,
  updateMedicine,
  deleteMedicine,
  updateOrderStatus,
  getSellerOrders,
  getSellerStats,
  getSellerMedicines,
};
