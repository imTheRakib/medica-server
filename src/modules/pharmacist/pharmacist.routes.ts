import { Router } from "express";
import authMiddileware from "../../middlewares/authMiddleware";
import { UserRole } from "../../types/enums/UserRoles";
import { PharmacistController } from "./pharmacist.controller";

const router = Router();

router.get(
  "/medicines/pending",
  authMiddileware(UserRole.PHARMACIST),
  PharmacistController.getPendingMedicines,
);

router.patch(
  "/medicines/:id/verification",
  authMiddileware(UserRole.PHARMACIST),
  PharmacistController.verifyMedicine,
);

router.post(
  "/category-recommendations",
  authMiddileware(UserRole.PHARMACIST),
  PharmacistController.createCategoryRecommendation,
);

router.patch(
  "/category-recommendations/:id",
  authMiddileware(UserRole.PHARMACIST),
  PharmacistController.updateCategoryRecommendation,
);

router.post(
  "/questions",
  authMiddileware(UserRole.CUSTOMER),
  PharmacistController.createMedicineQuestion,
);

router.get(
  "/questions",
  authMiddileware(
    UserRole.CUSTOMER,
    UserRole.PHARMACIST,
    UserRole.ADMIN,
    UserRole.SELLER,
  ),
  PharmacistController.getMedicineQuestions,
);

router.post(
  "/questions/:questionId/replies",
  authMiddileware(UserRole.PHARMACIST),
  PharmacistController.answerMedicineQuestion,
);

router.patch(
  "/replies/:replyId/status",
  authMiddileware(UserRole.PHARMACIST, UserRole.ADMIN),
  PharmacistController.updateReplyStatus,
);

export const PharmacistRouter = router;
