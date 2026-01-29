import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (
  data: Omit<Category, "id" | "createdAt" | "updatedAt" | "userId">,
  userId: string,
) => {
  const result = await prisma.category.create({
    data: { ...data, userId: userId },
  });

  return result;
};

const getAllCategories = async (payload: {
  page: number;
  limit: number;
  skip: number;
}) => {
  const result = await prisma.category.findMany({
    take: payload.limit,
    skip: payload.skip,
  });

  const total = await prisma.category.count();

  return {
    result,
    meta: {
      page: payload.page,
      limit: payload.limit,
      total,
      totalPage: Math.ceil(total / payload.limit),
    },
  };
};

export const CategoryService = {
  createCategory,
  getAllCategories,
};
