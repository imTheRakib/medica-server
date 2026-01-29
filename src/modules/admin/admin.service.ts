import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/authMiddleware";

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

export const AdminService = {
  getAllUsers,
};
