import { prisma } from "../../lib/prisma";

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

export const OrderService = {
  createOrder,
  getOrderDetails,
  getUserOrders,
};
