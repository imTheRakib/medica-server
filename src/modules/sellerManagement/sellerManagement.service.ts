import { Medicines } from "../../../generated/prisma/client";
import { uploadToImageBB } from "../../config/imageBB";
import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../types/enums/OrderStatus";

interface ICreateMedicineData {
  name: string;
  description: string;
  price: number;
  stocks: number;
  manufacturer: string;
  categoryId: string;
  thumbnail?: string;
}

const createMedicine = async (
  data: ICreateMedicineData,
  userId: string,
  imageFile?: Express.Multer.File,
) => {
  let thumbnailUrl = null;

  //check category
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // check duplicate medicine
  const existingMedicine = await prisma.medicines.findFirst({
    where: {
      name: data.name,
      userId: userId,
      manufacturer: data.manufacturer,
    },
  });

  if (existingMedicine) {
    throw new Error(
      "Medicine with this name and manufacturer already exists in your inventory",
    );
  }

  // upload image to ImageBB
  if (imageFile) {
    const filename = `medicine-${Date.now()}-${imageFile.originalname}`;
    thumbnailUrl = await uploadToImageBB(imageFile.buffer, filename);
  }

  const result = await prisma.medicines.create({
    data: {
      ...data,
      userId: userId,
      thumbnail: thumbnailUrl,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
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

const getSellerStats = async (sellerId: string) => {
  return await prisma.$transaction(
    async (tx) => {
      const [
        totalMedicines,
        activeMedicines,
        inactiveMedicines,
        outOfStockMedicines,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalOrderItems,
        totalRevenue,
      ] = await Promise.all([
        // Medicine stats
        tx.medicines.count({
          where: { userId: sellerId },
        }),
        tx.medicines.count({
          where: { userId: sellerId, isActive: true },
        }),
        tx.medicines.count({
          where: { userId: sellerId, isActive: false },
        }),
        tx.medicines.count({
          where: { userId: sellerId, stocks: 0 },
        }),

        // Order stats
        tx.orders.count({
          where: {
            orderItems: {
              some: {
                medicine: {
                  userId: sellerId,
                },
              },
            },
          },
        }),
        tx.orders.count({
          where: {
            status: "PENDING",
            orderItems: {
              some: {
                medicine: {
                  userId: sellerId,
                },
              },
            },
          },
        }),
        tx.orders.count({
          where: {
            status: "CONFIRMED",
            orderItems: {
              some: {
                medicine: {
                  userId: sellerId,
                },
              },
            },
          },
        }),
        tx.orders.count({
          where: {
            status: "SHIPPED",
            orderItems: {
              some: {
                medicine: {
                  userId: sellerId,
                },
              },
            },
          },
        }),
        tx.orders.count({
          where: {
            status: "DELIVERED",
            orderItems: {
              some: {
                medicine: {
                  userId: sellerId,
                },
              },
            },
          },
        }),
        tx.orders.count({
          where: {
            status: "CANCELLED",
            orderItems: {
              some: {
                medicine: {
                  userId: sellerId,
                },
              },
            },
          },
        }),

        // Sales stats
        tx.orderItems.count({
          where: {
            medicine: {
              userId: sellerId,
            },
          },
        }),
        tx.orderItems.aggregate({
          where: {
            medicine: {
              userId: sellerId,
            },
            order: {
              status: {
                in: ["CONFIRMED", "SHIPPED", "DELIVERED"],
              },
            },
          },
          _sum: {
            price: true,
          },
        }),
      ]);

      // Calculate additional metrics
      const activeOrdersCount = pendingOrders + confirmedOrders + shippedOrders;
      const successfulOrders = deliveredOrders;
      const orderCompletionRate =
        totalOrders > 0
          ? Math.round((successfulOrders / totalOrders) * 100 * 100) / 100
          : 0;

      return {
        medicines: {
          total: totalMedicines,
          active: activeMedicines,
          inactive: inactiveMedicines,
          outOfStock: outOfStockMedicines,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          confirmed: confirmedOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
          active: activeOrdersCount,
        },
        sales: {
          totalOrderItems: totalOrderItems,
          totalRevenue: Number(totalRevenue._sum.price) || 0,
          successfulOrders,
          orderCompletionRate,
        },
      };
    },
    {
      timeout: 15000,
      maxWait: 5000,
    },
  );
};

const getSellerMedicines = async (
  sellerId: string,
  payload: {
    page: number;
    limit: number;
    skip: number;
  },
) => {
  const result = await prisma.medicines.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: {
      userId: sellerId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const total = await prisma.medicines.count({
    where: {
      userId: sellerId,
    },
  });

  // Transform Decimal to number
  const transformedResult = result.map((medicine) => ({
    ...medicine,
    price: Number(medicine.price),
  }));

  return {
    result: transformedResult,
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
  getSellerStats,
  getSellerMedicines,
};
