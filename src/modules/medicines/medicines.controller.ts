import { NextFunction, Request, Response } from "express";
import { MedicinesService } from "./medicines.service";
import paginationAndSortgHelper from "../../helpers/paginationAndSorting";

const getAllMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search } = req.query;

    const searchString = typeof search === "string" ? search : undefined;
    const categoryId = req.query.categoryId as string | undefined;

    const isActive = req.query.isActive
      ? req.query.isActive === "true"
        ? true
        : req.query.isActive === "false"
          ? false
          : undefined
      : undefined;

    const userId = req.query.userId as string | undefined;

    //pagination
    const { page, limit, skip, sortBy, sortOrder } = paginationAndSortgHelper(
      req.query,
    );

    const result = await MedicinesService.getAllMedicines({
      search: searchString,
      isActive,
      userId,
      categoryId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getMedicinebyId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: medicineId } = req.params;

    if (!medicineId) {
      throw new Error("Medicine id is requird");
    }

    const result = await MedicinesService.getMedicinebyId(medicineId as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getIsFeaturedMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MedicinesService.getIsFeaturedMedicine();

    res.status(200).json({
      success: true,
      message: "Featured medicines retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getTopViewedMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MedicinesService.getTopViewedMedicine();

    res.status(200).json({
      success: true,
      message: "Top viewed medicines retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllMedicineByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const { search } = req.query;

    if (!categoryId) {
      throw new Error("Category id is required");
    }

    const searchString = typeof search === "string" ? search : undefined;

    const isActive = req.query.isActive
      ? req.query.isActive === "true"
        ? true
        : req.query.isActive === "false"
          ? false
          : undefined
      : undefined;

    // Pagination
    const { page, limit, skip, sortBy, sortOrder } = paginationAndSortgHelper(
      req.query,
    );

    const result = await MedicinesService.getAllMedicineByCategoryId({
      categoryId: categoryId as string,
      search: searchString,
      isActive,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
export const MedicinesController = {
  getAllMedicines,
  getMedicinebyId,
  getIsFeaturedMedicine,
  getTopViewedMedicine,
  getAllMedicineByCategoryId,
};
