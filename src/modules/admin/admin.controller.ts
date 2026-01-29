import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import paginationAndSortgHelper from "../../helpers/paginationAndSorting";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //pagination
    const { page, limit, skip } = paginationAndSortgHelper(req.query);

    const result = await AdminService.getAllUsers({ page, limit, skip });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.params;
    const { status } = req.body;

    const result = await AdminService.updateUserStatus(
      userId as string,
      status,
    );

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllTableStats = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getAllTableStats();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Statistics fetched failed!";
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

export const AdminController = {
  getAllUsers,
  updateUserStatus,
  getAllTableStats,
};
