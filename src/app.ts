import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import config from "./config";
import { auth } from "./lib/auth";
import { AuthRouter } from "./modules/auth/auth.routes";
import { SellerManagementRouter } from "./modules/sellerManagement/sellerManagement.routes";
import { CategoryRouter } from "./modules/category/category.routes";
import errorHandler from "./middlewares/globalErrorHandler";
import { OrderRouter } from "./modules/orders/orders.routes";
import { AdminRouter } from "./modules/admin/admin.routes";
// import { notFound } from "./middlewares/notFound";

const app = express();

app.use(
  cors({
    origin: config.APP_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", AuthRouter);

app.all("/api/auth/*splat", toNodeHandler(auth));

// app.use("/api/medicines");

app.use("/api/orders", OrderRouter);

app.use("/api/seller", SellerManagementRouter);

app.use("/api/category", CategoryRouter);

app.use("/api/admin", AdminRouter);

app.use(errorHandler);

// app.use(notFound);

export default app;
