import { Medicines } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createMedicine = async (
  data: Omit<Medicines, "id" | "createdAt" | "updatedAt" | "userId">,
  userId: string,
) => {
  const result = await prisma.medicines.create({
    data: { ...data, userId: userId },
  });

  return result;
};

export const SellerManagementService = {
  createMedicine,
};
