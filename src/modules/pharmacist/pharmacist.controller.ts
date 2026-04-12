import { NextFunction, Request, Response } from "express";
import paginationAndSortgHelper from "../../helpers/paginationAndSorting";
import { PharmacistService } from "./pharmacist.service";


const verifyMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: medicineId } = req.params as { id?: string };
    const pharmacistId = req.user?.id;
    const { status, note } = req.body as {
      status?: "APPROVED" | "REJECTED";
      note?: string;
    };

    if (!pharmacistId) {
      throw new Error("User is not authenticated");
    }

    if (!medicineId) {
      throw new Error("medicineId is required");
    }

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      throw new Error("status must be APPROVED or REJECTED");
    }

    const result = await PharmacistService.verifyMedicine(
      medicineId,
      pharmacistId,
      {
        status,
        ...(note ? { note } : {}),
      },
    );

    res.status(200).json({
      success: true,
      message: "Medicine verification updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getPendingMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, skip } = paginationAndSortgHelper(req.query);

    const result = await PharmacistService.getPendingMedicines({
      page,
      limit,
      skip,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const createCategoryRecommendation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId, note } = req.body as {
      categoryId?: string;
      note?: string;
    };

    if (!categoryId || !note?.trim()) {
      throw new Error("categoryId and note are required");
    }

    const result = await PharmacistService.createCategoryRecommendation(
      req.user?.id as string,
      {
        categoryId,
        note,
      },
    );

    res.status(201).json({
      success: true,
      message: "Category recommendation submitted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateCategoryRecommendation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { note } = req.body as { note?: string };

    if (!note?.trim()) {
      throw new Error("note is required");
    }

    const result = await PharmacistService.updateCategoryRecommendation(
      id as string,
      req.user?.id as string,
      { note },
    );

    res.status(200).json({
      success: true,
      message: "Category recommendation updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const createMedicineQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { medicineId, question } = req.body as {
      medicineId?: string;
      question?: string;
    };

    if (!medicineId || !question?.trim()) {
      throw new Error("medicineId and question are required");
    }

    const result = await PharmacistService.createMedicineQuestion(
      req.user?.id as string,
      {
        medicineId,
        question,
      },
    );

    res.status(201).json({
      success: true,
      message: "Question submitted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const answerMedicineQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { questionId } = req.params;
    const { reply } = req.body as { reply?: string };

    if (!reply?.trim()) {
      throw new Error("reply is required");
    }

    const result = await PharmacistService.answerMedicineQuestion(
      questionId as string,
      req.user?.id as string,
      { reply },
    );

    res.status(201).json({
      success: true,
      message: "Reply submitted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateReplyStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { replyId } = req.params;
    const { status } = req.body as { status?: "ACTIVE" | "HIDDEN" };

    if (!status || !["ACTIVE", "HIDDEN"].includes(status)) {
      throw new Error("status must be ACTIVE or HIDDEN");
    }

    const result = await PharmacistService.updateReplyStatus(
      replyId as string,
      {
        status,
      },
    );

    res.status(200).json({
      success: true,
      message: "Reply status updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getMedicineQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, skip } = paginationAndSortgHelper(req.query);
    const status = req.query.status as
      | "OPEN"
      | "ANSWERED"
      | "CLOSED"
      | undefined;
    const medicineId = req.query.medicineId as string | undefined;

    const payload: {
      page: number;
      limit: number;
      skip: number;
      status?: "OPEN" | "ANSWERED" | "CLOSED";
      medicineId?: string;
    } = {
      page,
      limit,
      skip,
    };

    if (status) {
      payload.status = status;
    }

    if (medicineId) {
      payload.medicineId = medicineId;
    }

    const result = await PharmacistService.getMedicineQuestions(payload);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const PharmacistController = {
  verifyMedicine,
  getPendingMedicines,
  createCategoryRecommendation,
  updateCategoryRecommendation,
  createMedicineQuestion,
  answerMedicineQuestion,
  updateReplyStatus,
  getMedicineQuestions,
};
