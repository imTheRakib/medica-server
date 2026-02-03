import { Router } from "express";
import { MedicinesController } from "./medicines.controller";

const router = Router();

router.get("/", MedicinesController.getAllMedicines);

router.get("/isFeatured", MedicinesController.getIsFeaturedMedicine);

router.get("/topViewed-medicine", MedicinesController.getTopViewedMedicine);

router.get("/:id", MedicinesController.getMedicinebyId);

router.get("/category/:categoryId", MedicinesController.getAllMedicineByCategoryId);

export const MedicinesRouter = router;
