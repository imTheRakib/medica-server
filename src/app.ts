import express, { Request, Response } from "express";
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
import { MedicinesRouter } from "./modules/medicines/medicines.routes";
import { notFound } from "./middlewares/notFound";
import { ReviewRouter } from "./modules/reviews/reviews.routes";
import { CartRouter } from "./modules/cart/cart.routes";

const app = express();

const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL,
].filter(Boolean);

// app.use(
//   cors({
//     origin: config.APP_URL,
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Medica - Medicine Management System API",
    description:
      "A comprehensive medicine management system for sellers and customers",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      medicines: "/api/medicines",
      orders: "/api/orders",
      seller: "/api/seller",
      admin: "/api/admin",
      categories: "/api/category",
      reviews: "/api/reviews",
    },
    features: {
      medicines: [
        "Browse all medicines",
        "Get featured medicines",
        "Get top viewed medicines",
        "Medicine details with reviews",
      ],
      seller: [
        "Medicine management",
        "Order management",
        "Sales statistics",
        "Inventory tracking",
      ],
      customer: [
        "Place orders",
        "Order history",
        "Cancel orders",
        "Product reviews",
      ],
      admin: [
        "User management",
        "System statistics",
        "Featured medicine control",
      ],
    },
    documentation: "Contact developer for API documentation",
  });
});

app.use("/api/auth", AuthRouter);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/medicines", MedicinesRouter);

app.use("/api/orders", OrderRouter);

app.use("/api/seller", SellerManagementRouter);

app.use("/api/category", CategoryRouter);

app.use("/api/admin", AdminRouter);

app.use("/api/reviews", ReviewRouter);

app.use("/api/cart", CartRouter);

app.use(errorHandler);

app.use(notFound);

export default app;
