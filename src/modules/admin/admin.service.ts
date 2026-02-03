import { prisma } from "../../lib/prisma";
import { UserRole } from "../../types/enums/UserRoles";
import { UserStatus } from "../../types/enums/UserStatus";

const getAllUsers = async (payload: {
  page: number;
  limit: number;
  skip: number;
}) => {
  const result = await prisma.user.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: {
      role: {
        not: UserRole.ADMIN,
      },
    },
  });

  const total = await prisma.user.count({
    where: {
      role: { not: UserRole.ADMIN },
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

const updateUserStatus = async (userId: string, newStatus: UserStatus) => {
  //find user
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) {
    throw new Error("User not found");
  }

  if (findUser.role === UserRole.ADMIN) {
    throw new Error("Cannot update admin user status");
  }

  if (!Object.values(UserStatus).includes(newStatus)) {
    throw new Error(
      `Invalid status. Valid statuses are: ${Object.values(UserStatus).join(", ")}`,
    );
  }

  //upate user status
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: { status: newStatus },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  return result;
};

const getAllTableStats = async () => {
  return await prisma.$transaction(
    async (tx) => {
      const [
        totalMedicines,
        activeMedicines,
        inactiveMedicines,
        totalOrders,
        totalReviews,
        totalUsers,
        sellerCount,
        buyerCount,
        totalViews,
        totalRevenue,
        outOfStock,
      ] = await Promise.all([
        await tx.medicines.count(),
        await tx.medicines.count({ where: { isActive: true } }),
        await tx.medicines.count({ where: { isActive: false } }),
        await tx.orderItems.count(),
        await tx.reviews.count(),
        await tx.user.count(),
        await tx.user.count({ where: { role: "SELLER" } }),
        await tx.user.count({ where: { role: "CUSTOMER" } }),
        await tx.medicines.aggregate({ _sum: { views: true } }),
        await tx.medicines.aggregate({ _sum: { price: true } }),
        await tx.medicines.count({ where: { stocks: { lte: 0 } } }),
      ]);

      return {
        totalMedicines,
        activeMedicines,
        inactiveMedicines,
        totalOrders,
        totalReviews,
        totalUsers,
        sellerCount,
        buyerCount,
        totalViews: totalViews._sum.views || 0,
        totalRevenue: Number(totalRevenue._sum.price) || 0,
        outOfStock,
      };
    },
    {
      timeout: 15000,
      maxWait: 5000,
    },
  );
};

const deleteUser = async (id: string) => {
  // Find the user first
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  //prevent admin delete
  if (user.role === UserRole.ADMIN) {
    throw new Error("Cannot delete admin user");
  }

  const deletedUser = await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return deletedUser;
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllTableStats,
  deleteUser,
};
