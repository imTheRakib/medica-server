import { Request, Response } from "express";
import { SellerManagementService } from "./sellerManagement.service";

const createMedicine = async (req: Request, res: Response) => {
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
    res.status(500).json({
      success: false,
      message: error || "Failed to create medicine",
    });
  }
};

export const SellerManagementController = {
  createMedicine,
};
