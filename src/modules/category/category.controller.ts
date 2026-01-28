import { Request, Response } from "express";
import { CategoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
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
    res.status(500).json({
      success: false,
      message: error || "Failed to create category",
    });
  }
};

export const CategoryController = {
  createCategory,
};
