import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../types/enums/OrderStatus";

interface IOrderItemInput {
  medicineId: string;
  quantity: number;
}

interface IOrderItemWithPrice {
  medicineId: string;
  quantity: number;
  price: number;
}

const createOrder = async (
  userId: string,
  orderItems: IOrderItemInput[],
  shippingAddress: string,
  paymentMethod: string,
) => {
  if (orderItems.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  // Group items by seller
  const itemsBySeller = new Map<
    string,
    { items: IOrderItemWithPrice[]; total: number }
  >();

  for (const item of orderItems) {
    const medicineData = await prisma.medicines.findUnique({
      where: { id: item.medicineId },
      select: {
        id: true,
        price: true,
        name: true,
        stocks: true,
        userId: true,
      },
    });

    if (!medicineData) {
      throw new Error(`Medicine not found: ${item.medicineId}`);
    }

    if (medicineData.stocks < item.quantity) {
      throw new Error(
        `Insufficient stocks. Available: ${medicineData.stocks}, Requested: ${item.quantity}`,
      );
    }

    const itemTotal = Number(medicineData.price) * item.quantity;
    const sellerId = medicineData.userId;

    if (!itemsBySeller.has(sellerId)) {
      itemsBySeller.set(sellerId, { items: [], total: 0 });
    }

    const sellerGroup = itemsBySeller.get(sellerId)!;
    sellerGroup.items.push({
      medicineId: item.medicineId,
      quantity: item.quantity,
      price: Number(medicineData.price),
    });
    sellerGroup.total += itemTotal;
  }

  // crete separate orders for each seller
  const result = await prisma.$transaction(async (tx) => {
    const orders = [];

    for (const [sellerId, { items, total }] of itemsBySeller) {
      const order = await tx.orders.create({
        data: {
          userId,
          totalAmount: total,
          paymentMethod,
          shippingAddress,
          orderItems: {
            create: items,
          },
        },
        include: {
          orderItems: {
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  seller: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
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
      });

      orders.push(order);
    }

    // Update stocks
    for (const item of orderItems) {
      await tx.medicines.update({
        where: { id: item.medicineId },
        data: { stocks: { decrement: item.quantity } },
      });
    }

    return orders;
  });

  return result;
};

const getUserOrders = async (userId: string) => {
  const result = await prisma.orders.findMany({
    where: { userId },
    include: {
      orderItems: {
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
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.orders.count({
    where: { userId },
  });

  return { result, meta: { total } };
};

const getAllOrders = async (payload: {
  page: number;
  limit: number;
  skip: number;
}) => {
  const result = await prisma.orders.findMany({
    take: payload.limit,
    skip: payload.skip,
    include: {
      orderItems: {
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
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.orders.count();

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

const getOrderDetails = async (orderId: string, userId: string) => {
  const result = await prisma.orders.findUnique({
    where: {
      id: orderId,
      userId,
    },
    include: {
      orderItems: {
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
  });

  if (!result) {
    throw new Error("Order not found");
  }

  return result;
};

const cancelOrder = async (orderId: string, userId: string) => {
  const orderData = await prisma.orders.findUniqueOrThrow({
    where: {
      id: orderId,
      userId: userId,
    },
    include: {
      orderItems: true,
    },
  });

  // check cancel validity
  if (orderData.status === OrderStatus.CANCELLED) {
    throw new Error("Order is already cancelled");
  }

  if (orderData.status === OrderStatus.DELIVERED) {
    throw new Error("Cannot cancel a delivered order");
  }

  if (orderData.status === OrderStatus.SHIPPED) {
    throw new Error("Cannot cancel a shipped order");
  }

  // Cancel ordr
  const result = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.orders.update({
      where: {
        id: orderId,
      },
      data: { status: OrderStatus.CANCELLED },
      include: {
        orderItems: {
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
      },
    });

    // restock medicines
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

    return updatedOrder;
  });

  return result;
};

const getCustomerOrderStats = async (userId: string) => {
  return await prisma.$transaction(
    async (tx) => {
      const [totalOrders, pendingOrders, totalSpent, totalOrderItems] =
        await Promise.all([
          tx.orders.count({
            where: { userId },
          }),

          tx.orders.count({
            where: { userId, status: "PENDING" },
          }),

          // totalspent
          tx.orders.aggregate({
            where: {
              userId,
              status: {
                not: "CANCELLED",
              },
            },
            _sum: {
              totalAmount: true,
            },
          }),

          tx.orderItems.count({
            where: {
              order: {
                userId,
              },
            },
          }),
        ]);

      return {
        totalOrders,
        pendingOrders,
        totalSpent: Number(totalSpent._sum.totalAmount) || 0,
        totalOrderItems,
      };
    },
    {
      timeout: 15000,
      maxWait: 5000,
    },
  );
};

const getRecentOrders = async (userId: string) => {
  const result = await prisma.orders.findMany({
    where: { userId },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              thumbnail: true,
              price: true,
            },
          },
        },
      },
    },
  });

  const transformedResult = result.map((order) => ({
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    itemCount: order.orderItems.length,
    medicines: order.orderItems.map((item) => ({
      id: item.medicine.id,
      name: item.medicine.name,
      thumbnail: item.medicine.thumbnail,
      price: Number(item.medicine.price),
      quantity: item.quantity,
      totalPrice: Number(item.price),
    })),
  }));

  return transformedResult;
};

export const OrderService = {
  createOrder,
  getOrderDetails,
  getUserOrders,
  cancelOrder,
  getCustomerOrderStats,
  getRecentOrders,
  getAllOrders,
};
