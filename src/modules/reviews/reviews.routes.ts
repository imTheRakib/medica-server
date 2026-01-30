import { Router } from "express";
import authMiddileware from "../../middlewares/authMiddleware";
import { ReviewController } from "./reviews.controller";
import { UserRole } from "../../types/enums/UserRoles";

const router = Router();

router.post(
  "/",
  authMiddileware(UserRole.CUSTOMER),
  ReviewController.createReview,
);
router.delete(
  "/:id",
  authMiddileware(UserRole.CUSTOMER),
  ReviewController.deleteReview,
);

export const ReviewRouter = router;
