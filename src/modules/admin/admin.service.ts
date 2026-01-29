import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/authMiddleware";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
}

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: {
        not: UserRole.ADMIN,
      },
    },
  });

  return result;
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

export const AdminService = {
  getAllUsers,
  updateUserStatus,
};
