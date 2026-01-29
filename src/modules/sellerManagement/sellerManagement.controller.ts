import { NextFunction, Request, Response } from "express";
import { SellerManagementService } from "./sellerManagement.service";

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await SellerManagementService.createMedicine(
      req.body,
      req.user?.id as string,
    );

    res.status(201).json({
      success: true,
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

export const SellerManagementController = {
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
