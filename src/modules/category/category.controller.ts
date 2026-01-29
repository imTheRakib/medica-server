import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.service";
import { get } from "node:http";
import paginationAndSortgHelper from "../../helpers/paginationAndSorting";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CategoryService.createCategory(
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

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    const { page, limit, skip } = paginationAndSortgHelper(req.query);

    const result = await CategoryService.getAllCategories({page, limit, skip});

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
};
