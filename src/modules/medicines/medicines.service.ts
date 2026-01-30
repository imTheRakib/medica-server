import { MedicinesWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllMedicines = async (payload: {
  search: string | undefined;
  isActive: boolean | undefined;
  userId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: MedicinesWhereInput[] = [];

  if (payload.search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (typeof payload.isActive === "boolean") {
    andConditions.push({
      isActive: payload.isActive,
    });
  }

  if (payload.userId) {
    andConditions.push({
      userId: payload.userId,
    });
  }

  const result = await prisma.medicines.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: {
      AND: andConditions,
    },
    orderBy: { [payload.sortBy]: payload.sortOrder },

    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  const total = await prisma.medicines.count({
    where: {
      AND: andConditions,
    },
  });

  // Transform Decimal to number
  const transformedResult = result.map((medicine) => ({
    ...medicine,
    price: Number(medicine.price),
  }));

  return {
    response: transformedResult,
    meta: {
      page: payload.page,
      limit: payload.limit,
      total,
      totalPage: Math.ceil(total / payload.limit),
    },
  };
};

//get medicine by id
const getMedicinebyId = async (medicineId: string) => {
  return await prisma.$transaction(
    async (tx) => {
      const medicineData = await tx.medicines.findUnique({
        where: {
          id: medicineId,
        },
        include: {
          reviews: {
            orderBy: { createdAt: "desc" },
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
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
          _count: {
            select: {
              reviews: true,
              orderItems: true,
            },
          },
        },
      });

      if (!medicineData) {
        throw new Error("Medicine not found");
      }

      // increment views
      await tx.medicines.update({
        where: {
          id: medicineId,
        },
        data: {
          views: { increment: 1 },
        },
      });

      //convert price to number
      return {
        ...medicineData,
        price: Number(medicineData.price),
      };
    },
    {
      timeout: 15000,
      maxWait: 5000,
    },
  );
};

const getIsFeaturedMedicine = async () => {
  const result = await prisma.medicines.findMany({
    where: {
      isFeatured: true,
      isActive: true,
      stocks: { gt: 0 },
    },
    take: 10,
    orderBy: [{ views: "desc" }, { createdAt: "desc" }],
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
      reviews: {
        select: {
          rating: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  //calculate average rating
  const transformedResult = result.map((medicine) => {
    const totalRating = medicine.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0,
    );
    const averageRating =
      medicine.reviews.length > 0 ? totalRating / medicine.reviews.length : 0;

    return {
      id: medicine.id,
      name: medicine.name,
      description: medicine.description,
      price: Number(medicine.price),
      stocks: medicine.stocks,
      thumbnail: medicine.thumbnail,
      manufacturer: medicine.manufacturer,
      isActive: medicine.isActive,
      isFeatured: medicine.isFeatured,
      views: medicine.views,
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt,
      category: medicine.category,
      seller: medicine.seller,
      reviewCount: medicine._count.reviews,
      averageRating: Math.round(averageRating * 100) / 100,
    };
  });

  return transformedResult;
};

const getTopViewedMedicine = async () => {
  const result = await prisma.medicines.findMany({
    where: {
      isActive: true,
      stocks: { gt: 0 },
    },
    take: 10,
    orderBy: [{ views: "desc" }, { createdAt: "desc" }],
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
      reviews: {
        select: {
          rating: true,
        },
      },
      _count: {
        select: {
          reviews: true,
          orderItems: true,
        },
      },
    },
  });

  //alculate average rating
  const transformedResult = result.map((medicine) => {
    const totalRating = medicine.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0,
    );
    const averageRating =
      medicine.reviews.length > 0 ? totalRating / medicine.reviews.length : 0;

    return {
      id: medicine.id,
      name: medicine.name,
      description: medicine.description,
      price: Number(medicine.price),
      stocks: medicine.stocks,
      thumbnail: medicine.thumbnail,
      manufacturer: medicine.manufacturer,
      isActive: medicine.isActive,
      isFeatured: medicine.isFeatured,
      views: medicine.views,
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt,
      category: medicine.category,
      seller: medicine.seller,
      reviewCount: medicine._count.reviews,
      totalSales: medicine._count.orderItems,
      averageRating: Math.round(averageRating * 100) / 100,
    };
  });

  return transformedResult;
};

export const MedicinesService = {
  getAllMedicines,
  getMedicinebyId,
  getIsFeaturedMedicine,
  getTopViewedMedicine,
};
