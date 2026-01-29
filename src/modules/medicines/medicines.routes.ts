import { Router } from "express";
import { MedicinesController } from "./medicines.controller";

const router = Router();

router.get("/", MedicinesController.getAllMedicines);

router.get("/:id", MedicinesController.getMedicinebyId);

export const MedicinesRouter = router;
