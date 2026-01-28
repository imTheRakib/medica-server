import { Decimal } from "@prisma/client/runtime/client";

export interface CreateMedicineInput {
  name: string;
  description: string;
  price: Decimal | string;
  stocks?: number;
  thumbnail?: string;
  manufacturer: string;
  isActive?: boolean;
  categoryId: string;
}
