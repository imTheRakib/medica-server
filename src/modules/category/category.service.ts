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

const getAllCategories = async () => {
  const result = await prisma.category.findMany();

  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
};
