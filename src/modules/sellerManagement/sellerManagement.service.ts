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

const updateMedicine = async (
  medicineId: string,
  data: Partial<Medicines>,
  userId: string,
) => {
  //find valid post exist or not
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  //match with current login userId
  if (medicineData.userId !== userId) {
    throw new Error("You are not the owner/creator of the medicine!");
  }

  //update
  const result = await prisma.medicines.update({
    where: {
      id: medicineData.id,
    },
    data,
  });

  return result;
};

const deleteMedicine = async (
  medicineId: string,
  userId: string,
) => {
  //find valid post exist or not
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  //match with current login userId
  if (medicineData.userId !== userId) {
    throw new Error("You are not the owner/creator of the medicine!");
  }

  //update
  const result = await prisma.medicines.delete({
    where: {
      id: medicineData.id,
    },
  });

  return result;
};

export const SellerManagementService = {
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
