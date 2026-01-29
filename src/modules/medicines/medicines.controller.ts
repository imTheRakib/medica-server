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

export const MedicinesController = {
  getAllMedicines,
  getMedicinebyId,
};
