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
export const AuthService = {
  getLoggedInUser,
};
