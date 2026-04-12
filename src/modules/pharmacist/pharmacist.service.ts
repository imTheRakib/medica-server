import { prisma } from "../../lib/prisma";

type VerificationStatus = "APPROVED" | "REJECTED";
type ReplyStatus = "ACTIVE" | "HIDDEN";

const verifyMedicine = async (
  medicineId: string,
  pharmacistId: string,
  payload: { status: VerificationStatus; note?: string },
) => {
  const medicine = await prisma.medicines.findUnique({
    where: { id: medicineId },
    select: {
      id: true,
      name: true,
      verificationStatus: true,
    },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  if (payload.status === "REJECTED" && !payload.note?.trim()) {
    throw new Error("A rejection note is required when rejecting a medicine");
  }

  return prisma.medicines.update({
    where: { id: medicineId },
    data: {
      verificationStatus: payload.status,
      verificationNote: payload.note?.trim() || null,
      verifiedById: pharmacistId,
      verifiedAt: new Date(),
      isActive: payload.status === "APPROVED",
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      verifiedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const getPendingMedicines = async (payload: {
  page: number;
  limit: number;
  skip: number;
}) => {
  const result = await prisma.medicines.findMany({
    where: {
      verificationStatus: "PENDING",
    },
    take: payload.limit,
    skip: payload.skip,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
      verificationStatus: "PENDING",
    },
  });

  return {
    result: result.map((medicine) => ({
      ...medicine,
      price: Number(medicine.price),
    })),
    meta: {
      page: payload.page,
      limit: payload.limit,
      total,
      totalPage: Math.ceil(total / payload.limit),
    },
  };
};

const createCategoryRecommendation = async (
  pharmacistId: string,
  payload: { categoryId: string; note: string },
) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
    select: { id: true },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.categoryRecommendation.create({
    data: {
      categoryId: payload.categoryId,
      pharmacistId,
      note: payload.note.trim(),
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      pharmacist: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const updateCategoryRecommendation = async (
  recommendationId: string,
  pharmacistId: string,
  payload: { note: string },
) => {
  const existing = await prisma.categoryRecommendation.findUnique({
    where: { id: recommendationId },
    select: {
      id: true,
      pharmacistId: true,
    },
  });

  if (!existing) {
    throw new Error("Recommendation not found");
  }

  if (existing.pharmacistId !== pharmacistId) {
    throw new Error("You can only update your own recommendation");
  }

  return prisma.categoryRecommendation.update({
    where: { id: recommendationId },
    data: {
      note: payload.note.trim(),
    },
  });
};

const createMedicineQuestion = async (
  customerId: string,
  payload: { medicineId: string; question: string },
) => {
  const medicine = await prisma.medicines.findUnique({
    where: { id: payload.medicineId },
    select: {
      id: true,
      verificationStatus: true,
    },
  });

  if (!medicine || medicine.verificationStatus !== "APPROVED") {
    throw new Error("Medicine not found");
  }

  return prisma.medicineQuestion.create({
    data: {
      customerId,
      medicineId: payload.medicineId,
      question: payload.question.trim(),
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      medicine: {
        select: {
          id: true,
          name: true,
          manufacturer: true,
        },
      },
    },
  });
};

const answerMedicineQuestion = async (
  questionId: string,
  pharmacistId: string,
  payload: { reply: string },
) => {
  const question = await prisma.medicineQuestion.findUnique({
    where: { id: questionId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  if (question.status === "CLOSED") {
    throw new Error("Question is closed");
  }

  return prisma.$transaction(async (tx) => {
    const reply = await tx.medicineQuestionReply.create({
      data: {
        questionId,
        pharmacistId,
        reply: payload.reply.trim(),
        status: "ACTIVE",
      },
      include: {
        pharmacist: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await tx.medicineQuestion.update({
      where: { id: questionId },
      data: {
        status: "ANSWERED",
      },
    });

    return reply;
  });
};

const updateReplyStatus = async (
  replyId: string,
  payload: { status: ReplyStatus },
) => {
  const existing = await prisma.medicineQuestionReply.findUnique({
    where: { id: replyId },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new Error("Reply not found");
  }

  return prisma.medicineQuestionReply.update({
    where: { id: replyId },
    data: {
      status: payload.status,
    },
  });
};

const getMedicineQuestions = async (payload: {
  page: number;
  limit: number;
  skip: number;
  status?: "OPEN" | "ANSWERED" | "CLOSED";
  medicineId?: string;
}) => {
  const result = await prisma.medicineQuestion.findMany({
    where: {
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.medicineId ? { medicineId: payload.medicineId } : {}),
    },
    take: payload.limit,
    skip: payload.skip,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      medicine: {
        select: {
          id: true,
          name: true,
        },
      },
      replies: {
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          pharmacist: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.medicineQuestion.count({
    where: {
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.medicineId ? { medicineId: payload.medicineId } : {}),
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

export const PharmacistService = {
  verifyMedicine,
  getPendingMedicines,
  createCategoryRecommendation,
  updateCategoryRecommendation,
  createMedicineQuestion,
  answerMedicineQuestion,
  updateReplyStatus,
  getMedicineQuestions,
};
