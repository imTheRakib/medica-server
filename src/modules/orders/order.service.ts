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
  //validate order item
  if (orderItems.length === 0) {
    throw new Error("Order must containt at least one item");
  }

  //calc total amount of medicine
  let totalAmount = 0;
  const orderItemsWithPrice: IOrderItemWithPrice[] = [];

  for (const item of orderItems) {
    const medicineData = await prisma.medicines.findUnique({
      where: { id: item.medicineId },
      select: {
        id: true,
        price: true,
        name: true,
        stocks: true,
      },
    });
    if (!medicineData) {
      throw new Error("Medicine not found");
    }
    if (medicineData.stocks < item.quantity) {
      throw new Error(
        `Insufficient stocks, Available: ${medicineData.stocks}, Requested: ${item.quantity}`,
      );
    }

    const itemTotal = Number(medicineData.price) * item.quantity;
    totalAmount += itemTotal;

    orderItemsWithPrice.push({
      medicineId: item.medicineId,
      quantity: item.quantity,
      price: Number(medicineData.price),
    });
  }

  //crate order
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.orders.create({
      data: {
        userId,
        totalAmount,
        paymentMethod,
        shippingAddress,
        orderItems: {
          create: orderItemsWithPrice,
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

    //update stocks
    for (const item of orderItems) {
      await tx.medicines.update({
        where: {
          id: item.medicineId,
        },
        data: {
          stocks: {
            decrement: item.quantity,
          },
        },
      });
    }

    return order;
  });

  return result;
};

export const OrderService = {
  createOrder,
};
