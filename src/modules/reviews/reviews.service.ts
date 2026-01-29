import { prisma } from "../../lib/prisma";

interface ICreateReviewInput {
  medicineId: string;
  rating: number;
  comment: string;
}

const createReview = async (userId: string, payload: ICreateReviewInput) => {
  const { medicineId, rating, comment } = payload;

  // validate rating range
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // check medicine exists
  const medicine = await prisma.medicines.findUnique({
    where: { id: medicineId },
    select: { id: true, name: true },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  // check if user aleready give review or not
  const existingReview = await prisma.reviews.findFirst({
    where: {
      userId,
      medicineId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this medicine");
  }

  // Create
  const result = await prisma.reviews.create({
    data: {
      userId,
      medicineId,
      rating,
      comment,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      medicine: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return result;
};

const deleteReview = async (reviewId: string, userId: string) => {
  // check exist or not
  const existingReview = await prisma.reviews.findFirst({
    where: {
      id: reviewId,
      userId,
    },
  });

  if (!existingReview) {
    throw new Error(
      "Review not found or you don't have permission to delete it",
    );
  }

  await prisma.reviews.delete({
    where: {
      id: reviewId,
    },
  });

  return { message: "Review deleted successfully" };
};

export const ReviewService = {
  createReview,
  deleteReview,
};
