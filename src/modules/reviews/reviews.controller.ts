import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./reviews.service";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { medicineId, rating, comment } = req.body;

    if (!user) {
      throw new Error("You are not authorized");
    }

    const result = await ReviewService.createReview(user.id, {
      medicineId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: reviewId } = req.params;
    const user = req.user;

    if (!user) {
      throw new Error("You are not authorized");
    }

    const result = await ReviewService.deleteReview(
      reviewId as string,
      user.id,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const ReviewController = {
  createReview,
  deleteReview,
};
