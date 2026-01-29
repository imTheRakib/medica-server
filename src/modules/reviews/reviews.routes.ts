import { Router } from "express";
import authMiddileware, { UserRole } from "../../middlewares/authMiddleware";
import { ReviewController } from "./reviews.controller";

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
