import { Medicines } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

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

const deleteMedicine = async (medicineId: string, userId: string) => {
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

const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus,
  sellerId: string,
) => {
  const orderData = await prisma.orders.findUniqueOrThrow({
    where: {
      id: orderId,
    },
    include: {
      orderItems: {
        include: {
          medicine: {
            select: {
              id: true,
              userId: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // check current user is owner of all medicine or not
  const allMedicinesOwnedBySeller = orderData.orderItems.every(
    (item) => item.medicine.userId === sellerId,
  );

  if (!allMedicinesOwnedBySeller) {
    throw new Error(
      "You can only update status for orders containing your medicines!",
    );
  }

  // Update order status
  const result = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.orders.update({
      where: {
        id: orderData.id,
      },
      data: { status: newStatus },
    });

    // restock for cancled
    if (newStatus === OrderStatus.CANCELLED) {
      for (const item of orderData.orderItems) {
        await tx.medicines.update({
          where: {
            id: item.medicineId,
          },
          data: {
            stocks: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    return updatedOrder;
  });

  return result;
};

const getSellerOrders = async (
  sellerId: string,
  payload: {
    page: number;
    limit: number;
    skip: number;
  },
) => {
  const result = await prisma.orders.findMany({
    take: payload.limit,
    skip: payload.skip,

    where: {
      orderItems: {
        some: {
          medicine: {
            userId: sellerId,
          },
        },
      },
    },
    include: {
      orderItems: {
        where: {
          medicine: {
            userId: sellerId,
          },
        },
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.orders.count({
    where: {
      orderItems: {
        some: {
          medicine: {
            userId: sellerId,
          },
        },
      },
    },
  });

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

export const SellerManagementService = {
  createMedicine,
  updateMedicine,
  deleteMedicine,
  updateOrderStatus,
  getSellerOrders,
};
