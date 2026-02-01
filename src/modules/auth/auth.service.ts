import { prisma } from "../../lib/prisma";

const getLoggedInUser = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!result) {
    throw new Error("User not found");
  }

  return result;
};

const updateProfile = async (
  userId: string,
  updateData: { name?: string; phone?: string },
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  //update
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(updateData.name && { name: updateData.name }),
      ...(updateData.phone && { phone: updateData.phone }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};
export const AuthService = {
  getLoggedInUser,
  updateProfile,
};
