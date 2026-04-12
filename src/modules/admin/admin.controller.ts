import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import paginationAndSortgHelper from "../../helpers/paginationAndSorting";
import { UserRole } from "../../types/enums/UserRoles";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //pagination
    const { page, limit, skip } = paginationAndSortgHelper(req.query);

    const result = await AdminService.getAllUsers(
      { page, limit, skip },
      req.user?.role as UserRole,
    );

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
      req.user?.role as UserRole,
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

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params;

    const result = await AdminService.deleteUser(
      userId as string,
      req.user?.role as UserRole,
    );

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const AdminController = {
  getAllUsers,
  updateUserStatus,
  getAllTableStats,
  deleteUser,
};
