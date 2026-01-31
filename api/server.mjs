var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config = {
  port: process.env.PORT,
  APP_URL: process.env.APP_URL,
  APP_USERNANE: process.env.APP_USERNAME,
  APP_PASSWORD: process.env.APP_PASSWORD,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  IMAGEBB_API_KEY: process.env.IMAGEBB_API_KEY
};
var config_default = config;

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String      @id\n  name          String\n  email         String\n  emailVerified Boolean     @default(false)\n  image         String?\n  createdAt     DateTime    @default(now())\n  updatedAt     DateTime    @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  medicines     Medicines[]\n  orders        Orders[]\n  reviews       Reviews[]\n  category      Category[]\n\n  role   String  @default("CUSTOMER")\n  phone  String?\n  status String? @default("ACTIVE")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Category {\n  id          String   @id @default(uuid())\n  name        String   @db.VarChar(255)\n  description String   @db.Text\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n  userId      String\n\n  admin     User        @relation(fields: [userId], references: [id])\n  medicines Medicines[]\n\n  @@index([userId])\n  @@map("category")\n}\n\nmodel Medicines {\n  id           String   @id @default(uuid())\n  name         String   @db.VarChar(255)\n  description  String   @db.Text\n  price        Decimal  @db.Decimal(10, 2)\n  stocks       Int      @default(0)\n  thumbnail    String?\n  manufacturer String\n  isActive     Boolean  @default(true)\n  isFeatured   Boolean  @default(false)\n  categoryId   String\n  userId       String\n  views        Int      @default(0)\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  category   Category     @relation(fields: [categoryId], references: [id])\n  seller     User         @relation(fields: [userId], references: [id])\n  orderItems OrderItems[]\n  reviews    Reviews[]\n\n  @@unique([name, userId, manufacturer], name: "unique_medicine_per_seller")\n  //indexing\n  @@index([userId])\n  @@index([categoryId])\n  @@map("medicines")\n}\n\nmodel OrderItems {\n  id         String  @id @default(uuid())\n  orderId    String\n  medicineId String\n  quantity   Int\n  price      Decimal @db.Decimal(10, 2)\n\n  order    Orders    @relation(fields: [orderId], references: [id])\n  medicine Medicines @relation(fields: [medicineId], references: [id])\n\n  @@index([orderId])\n  @@index([medicineId])\n  @@map("orderItems")\n}\n\nenum OrderStatus {\n  PENDING\n  CONFIRMED\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel Orders {\n  id              String      @id @default(uuid())\n  userId          String\n  totalAmount     Decimal     @db.Decimal(10, 2)\n  paymentMethod   String      @default("COD")\n  status          OrderStatus @default(PENDING)\n  shippingAddress String\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n\n  customer User @relation(fields: [userId], references: [id])\n\n  orderItems OrderItems[]\n\n  @@index([userId])\n  @@map("orders")\n}\n\nmodel Reviews {\n  id         String   @id @default(uuid())\n  userId     String\n  medicineId String\n  rating     Int?\n  comment    String   @db.VarChar(300)\n  createdAt  DateTime @default(now())\n\n  customer User      @relation(fields: [userId], references: [id])\n  medicine Medicines @relation(fields: [medicineId], references: [id])\n\n  @@index([userId])\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"MedicinesToUser"},{"name":"orders","kind":"object","type":"Orders","relationName":"OrdersToUser"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"ReviewsToUser"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"User","relationName":"CategoryToUser"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"CategoryToMedicines"}],"dbName":"category"},"Medicines":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"stocks","kind":"scalar","type":"Int"},{"name":"thumbnail","kind":"scalar","type":"String"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"views","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicines"},{"name":"seller","kind":"object","type":"User","relationName":"MedicinesToUser"},{"name":"orderItems","kind":"object","type":"OrderItems","relationName":"MedicinesToOrderItems"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"MedicinesToReviews"}],"dbName":"medicines"},"OrderItems":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"order","kind":"object","type":"Orders","relationName":"OrderItemsToOrders"},{"name":"medicine","kind":"object","type":"Medicines","relationName":"MedicinesToOrderItems"}],"dbName":"orderItems"},"Orders":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"paymentMethod","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"OrdersToUser"},{"name":"orderItems","kind":"object","type":"OrderItems","relationName":"OrderItemsToOrders"}],"dbName":"orders"},"Reviews":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewsToUser"},{"name":"medicine","kind":"object","type":"Medicines","relationName":"MedicinesToReviews"}],"dbName":"reviews"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MedicinesScalarFieldEnum: () => MedicinesScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemsScalarFieldEnum: () => OrderItemsScalarFieldEnum,
  OrdersScalarFieldEnum: () => OrdersScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewsScalarFieldEnum: () => ReviewsScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Category: "Category",
  Medicines: "Medicines",
  OrderItems: "OrderItems",
  Orders: "Orders",
  Reviews: "Reviews"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
var MedicinesScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  stocks: "stocks",
  thumbnail: "thumbnail",
  manufacturer: "manufacturer",
  isActive: "isActive",
  isFeatured: "isFeatured",
  categoryId: "categoryId",
  userId: "userId",
  views: "views",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemsScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  medicineId: "medicineId",
  quantity: "quantity",
  price: "price"
};
var OrdersScalarFieldEnum = {
  id: "id",
  userId: "userId",
  totalAmount: "totalAmount",
  paymentMethod: "paymentMethod",
  status: "status",
  shippingAddress: "shippingAddress",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewsScalarFieldEnum = {
  id: "id",
  userId: "userId",
  medicineId: "medicineId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";

// src/utils/emailTamplate.ts
var verificationEmailTemplate = (verificationUrl) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
          
          <tr>
            <td style="background-color:#4f46e5; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0;">Verify Your Email</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="font-size:16px;">Hi,</p>

              <p style="font-size:16px; line-height:1.6;">
                Thanks for signing up! Please verify your email address by clicking the button below.
              </p>

              <div style="text-align:center; margin:30px 0;">
                <a href="${verificationUrl}"
                  style="background-color:#4f46e5; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-size:16px; display:inline-block;">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#666;">
                If the button doesn\u2019t work, copy and paste this link into your browser:
              </p>

              <p style="font-size:14px; word-break:break-all;">
                <a href="${verificationUrl}" style="color:#4f46e5;">
                  ${verificationUrl}
                </a>
              </p>

              <p style="font-size:14px; color:#666;">
                If you did not create this account, you can ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#f4f4f4; padding:15px; text-align:center;">
              <p style="font-size:12px; color:#999; margin:0;">
                \xA9 2025 Your App. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// src/lib/auth.ts
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config_default.APP_USERNANE,
    pass: config_default.APP_PASSWORD
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [config_default.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: true
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${config_default.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Medica" <ashrafulatif08@gmail.com>',
          to: user.email,
          subject: `${user.name} Please verify your account`,
          html: verificationEmailTemplate(verificationUrl)
        });
      } catch (error) {
        throw error;
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: config_default.GOOGLE_CLIENT_ID,
      clientSecret: config_default.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/modules/auth/auth.routes.ts
import { Router } from "express";

// src/modules/auth/auth.service.ts
var getLoggedInUser = async (userId) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!result) {
    throw new Error("User not found");
  }
  return result;
};
var AuthService = {
  getLoggedInUser
};

// src/modules/auth/auth.controller.ts
var getLoggedInUser2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are not authorized");
    }
    const result = await AuthService.getLoggedInUser(user.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var AuthController = {
  getLoggedInUser: getLoggedInUser2
};

// src/middlewares/authMiddleware.ts
var authMiddileware = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required. Please verfiy your email!"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access this resources!"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var authMiddleware_default = authMiddileware;

// src/modules/auth/auth.routes.ts
var router = Router();
router.get(
  "/me",
  authMiddleware_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  AuthController.getLoggedInUser
);
var AuthRouter = router;

// src/modules/sellerManagement/sellerManagement.routes.ts
import { Router as Router2 } from "express";

// src/config/imageBB.ts
import axios from "axios";
import FormData from "form-data";
var uploadToImageBB = async (imageBuffer, filename) => {
  try {
    const formData = new FormData();
    formData.append("image", imageBuffer.toString("base64"));
    formData.append("name", filename);
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${config_default.IMAGEBB_API_KEY}`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );
    return response.data.data.url;
  } catch (error) {
    console.error("ImageBB upload error:", error);
    throw new Error("Failed to upload image to ImageBB");
  }
};

// src/modules/sellerManagement/sellerManagement.service.ts
var createMedicine = async (data, userId, imageFile) => {
  let thumbnailUrl = null;
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const existingMedicine = await prisma.medicines.findFirst({
    where: {
      name: data.name,
      userId,
      manufacturer: data.manufacturer
    }
  });
  if (existingMedicine) {
    throw new Error(
      "Medicine with this name and manufacturer already exists in your inventory"
    );
  }
  if (imageFile) {
    const filename = `medicine-${Date.now()}-${imageFile.originalname}`;
    thumbnailUrl = await uploadToImageBB(imageFile.buffer, filename);
  }
  const result = await prisma.medicines.create({
    data: {
      ...data,
      userId,
      thumbnail: thumbnailUrl
    },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return result;
};
var updateMedicine = async (medicineId, data, userId) => {
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId
    },
    select: {
      id: true,
      userId: true
    }
  });
  if (medicineData.userId !== userId) {
    throw new Error("You are not the owner/creator of the medicine!");
  }
  const result = await prisma.medicines.update({
    where: {
      id: medicineData.id
    },
    data
  });
  return result;
};
var deleteMedicine = async (medicineId, userId) => {
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId
    },
    select: {
      id: true,
      userId: true
    }
  });
  if (medicineData.userId !== userId) {
    throw new Error("You are not the owner/creator of the medicine!");
  }
  const result = await prisma.medicines.delete({
    where: {
      id: medicineData.id
    }
  });
  return result;
};
var updateOrderStatus = async (orderId, newStatus, sellerId) => {
  const orderData = await prisma.orders.findUniqueOrThrow({
    where: {
      id: orderId
    },
    include: {
      orderItems: {
        include: {
          medicine: {
            select: {
              id: true,
              userId: true,
              name: true
            }
          }
        }
      }
    }
  });
  const allMedicinesOwnedBySeller = orderData.orderItems.every(
    (item) => item.medicine.userId === sellerId
  );
  if (!allMedicinesOwnedBySeller) {
    throw new Error(
      "You can only update status for orders containing your medicines!"
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.orders.update({
      where: {
        id: orderData.id
      },
      data: { status: newStatus }
    });
    if (newStatus === "CANCELLED" /* CANCELLED */) {
      for (const item of orderData.orderItems) {
        await tx.medicines.update({
          where: {
            id: item.medicineId
          },
          data: {
            stocks: {
              increment: item.quantity
            }
          }
        });
      }
    }
    return updatedOrder;
  });
  return result;
};
var getSellerOrders = async (sellerId, payload) => {
  const result = await prisma.orders.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: {
      orderItems: {
        some: {
          medicine: {
            userId: sellerId
          }
        }
      }
    },
    include: {
      orderItems: {
        where: {
          medicine: {
            userId: sellerId
          }
        },
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        }
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const total = await prisma.orders.count({
    where: {
      orderItems: {
        some: {
          medicine: {
            userId: sellerId
          }
        }
      }
    }
  });
  return {
    result,
    meta: {
      page: payload.page,
      limit: payload.limit,
      total,
      totalPage: Math.ceil(total / payload.limit)
    }
  };
};
var getSellerStats = async (sellerId) => {
  return await prisma.$transaction(
    async (tx) => {
      const [
        totalMedicines,
        activeMedicines,
        inactiveMedicines,
        outOfStockMedicines,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalOrderItems,
        totalRevenue
      ] = await Promise.all([
        // Medicine stats
        tx.medicines.count({
          where: { userId: sellerId }
        }),
        tx.medicines.count({
          where: { userId: sellerId, isActive: true }
        }),
        tx.medicines.count({
          where: { userId: sellerId, isActive: false }
        }),
        tx.medicines.count({
          where: { userId: sellerId, stocks: 0 }
        }),
        // Order stats
        tx.orders.count({
          where: {
            orderItems: {
              some: {
                medicine: {
                  userId: sellerId
                }
              }
            }
          }
        }),
        tx.orders.count({
          where: {
            status: "PENDING",
            orderItems: {
              some: {
                medicine: {
                  userId: sellerId
                }
              }
            }
          }
        }),
        tx.orders.count({
          where: {
            status: "CONFIRMED",
            orderItems: {
              some: {
                medicine: {
                  userId: sellerId
                }
              }
            }
          }
        }),
        tx.orders.count({
          where: {
            status: "SHIPPED",
            orderItems: {
              some: {
                medicine: {
                  userId: sellerId
                }
              }
            }
          }
        }),
        tx.orders.count({
          where: {
            status: "DELIVERED",
            orderItems: {
              some: {
                medicine: {
                  userId: sellerId
                }
              }
            }
          }
        }),
        tx.orders.count({
          where: {
            status: "CANCELLED",
            orderItems: {
              some: {
                medicine: {
                  userId: sellerId
                }
              }
            }
          }
        }),
        // Sales stats
        tx.orderItems.count({
          where: {
            medicine: {
              userId: sellerId
            }
          }
        }),
        tx.orderItems.aggregate({
          where: {
            medicine: {
              userId: sellerId
            },
            order: {
              status: {
                in: ["CONFIRMED", "SHIPPED", "DELIVERED"]
              }
            }
          },
          _sum: {
            price: true
          }
        })
      ]);
      const activeOrdersCount = pendingOrders + confirmedOrders + shippedOrders;
      const successfulOrders = deliveredOrders;
      const orderCompletionRate = totalOrders > 0 ? Math.round(successfulOrders / totalOrders * 100 * 100) / 100 : 0;
      return {
        medicines: {
          total: totalMedicines,
          active: activeMedicines,
          inactive: inactiveMedicines,
          outOfStock: outOfStockMedicines
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          confirmed: confirmedOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
          active: activeOrdersCount
        },
        sales: {
          totalOrderItems,
          totalRevenue: Number(totalRevenue._sum.price) || 0,
          successfulOrders,
          orderCompletionRate
        }
      };
    },
    {
      timeout: 15e3,
      maxWait: 5e3
    }
  );
};
var SellerManagementService = {
  createMedicine,
  updateMedicine,
  deleteMedicine,
  updateOrderStatus,
  getSellerOrders,
  getSellerStats
};

// src/helpers/paginationAndSorting.ts
var paginationAndSortgHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 5;
  const skip = (page - 1) * limit;
  const sortOrder = options.sortOrder || "asc";
  const sortBy = options.sortBy || "createdAt";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationAndSorting_default = paginationAndSortgHelper;

// src/modules/sellerManagement/sellerManagement.controller.ts
var createMedicine2 = async (req, res, next) => {
  try {
    const { name, description, price, stocks, manufacturer, categoryId } = req.body;
    const imageFile = req.file;
    const medicineData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stocks: parseInt(stocks),
      manufacturer: manufacturer.trim(),
      categoryId: categoryId.trim()
    };
    if (medicineData.price <= 0) {
      throw new Error("Price must be a valid positive number");
    }
    if (medicineData.stocks < 0) {
      throw new Error("Stocks must be a valid positive number");
    }
    const result = await SellerManagementService.createMedicine(
      medicineData,
      req.user?.id,
      imageFile
    );
    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateMedicine2 = async (req, res, next) => {
  try {
    const { id: medicineId } = req.params;
    const user = req.user;
    const result = await SellerManagementService.updateMedicine(
      medicineId,
      req.body,
      user?.id
    );
    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteMedicine2 = async (req, res, next) => {
  try {
    const { id: medicineId } = req.params;
    const user = req.user;
    const result = await SellerManagementService.deleteMedicine(
      medicineId,
      user?.id
    );
    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateOrderStatus2 = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const user = req.user;
    const { status } = req.body;
    const result = await SellerManagementService.updateOrderStatus(
      orderId,
      status,
      user?.id
    );
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getSellerOrders2 = async (req, res, next) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    const { page, limit, skip } = paginationAndSorting_default(req.query);
    const result = await SellerManagementService.getSellerOrders(sellerId, {
      page,
      limit,
      skip
    });
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getSellerStats2 = async (req, res, next) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    const result = await SellerManagementService.getSellerStats(sellerId);
    res.status(200).json({
      success: true,
      message: "Seller stats retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var SellerManagementController = {
  createMedicine: createMedicine2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2,
  updateOrderStatus: updateOrderStatus2,
  getSellerOrders: getSellerOrders2,
  getSellerStats: getSellerStats2
};

// src/config/upload.ts
import multer from "multer";
var storage = multer.memoryStorage();
var upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// src/modules/sellerManagement/sellerManagement.routes.ts
var router2 = Router2();
router2.get(
  "/orders",
  authMiddleware_default("SELLER" /* SELLER */),
  SellerManagementController.getSellerOrders
);
router2.get(
  "/statistics",
  authMiddleware_default("SELLER" /* SELLER */),
  SellerManagementController.getSellerStats
);
router2.post(
  "/medicines",
  authMiddleware_default("SELLER" /* SELLER */),
  upload.single("thumbnail"),
  SellerManagementController.createMedicine
);
router2.put(
  "/medicines/:id",
  authMiddleware_default("SELLER" /* SELLER */),
  SellerManagementController.updateMedicine
);
router2.patch(
  "/orders/:id",
  authMiddleware_default("SELLER" /* SELLER */),
  SellerManagementController.updateOrderStatus
);
router2.delete(
  "/medicines/:id",
  authMiddleware_default("SELLER" /* SELLER */),
  SellerManagementController.deleteMedicine
);
var SellerManagementRouter = router2;

// src/modules/category/category.routes.ts
import { Router as Router3 } from "express";

// src/modules/category/category.service.ts
var createCategory = async (data, userId) => {
  const result = await prisma.category.create({
    data: { ...data, userId }
  });
  return result;
};
var getAllCategories = async (payload) => {
  const result = await prisma.category.findMany({
    take: payload.limit,
    skip: payload.skip
  });
  const total = await prisma.category.count();
  return {
    result,
    meta: {
      page: payload.page,
      limit: payload.limit,
      total,
      totalPage: Math.ceil(total / payload.limit)
    }
  };
};
var CategoryService = {
  createCategory,
  getAllCategories
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    const result = await CategoryService.createCategory(
      req.body,
      req.user?.id
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllCategories2 = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginationAndSorting_default(req.query);
    const result = await CategoryService.getAllCategories({
      page,
      limit,
      skip
    });
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var CategoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2
};

// src/modules/category/category.routes.ts
var router3 = Router3();
router3.get("/", CategoryController.getAllCategories);
router3.post(
  "/",
  authMiddleware_default("ADMIN" /* ADMIN */),
  CategoryController.createCategory
);
var CategoryRouter = router3;

// src/middlewares/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMsg = "Internal Server Error";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMsg = "You have provided incorrect field or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 404;
      errorMsg = "Record not found";
    } else if (err.code === "P2002") {
      statusCode = 409;
      errorMsg = "Unique constraint failed";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMsg = "Foreign key constraint failed";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMsg = "Error occurred during query execution";
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMsg = "Prisma engine crashed";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMsg = "Authentication failed. Please check your credentials!";
    } else if (err.errorCode === "P1001") {
      statusCode = 500;
      errorMsg = "Can't reach database server";
    }
  } else if (err instanceof Error && err.message) {
    if (err.message.toLowerCase().includes("not found")) {
      statusCode = 404;
      errorMsg = err.message;
    } else if (err.message.includes("Cannot update") || err.message.includes("Invalid status") || err.message.includes("Invalid") || err.message.includes("required") || err.message.includes("must contain")) {
      statusCode = 400;
      errorMsg = err.message;
    } else if (err.message.includes("unauthorized") || err.message.includes("permission") || err.message.includes("not authorized")) {
      statusCode = 403;
      errorMsg = err.message;
    } else {
      statusCode = 400;
      errorMsg = err.message;
    }
  }
  res.status(statusCode).json({
    success: false,
    message: errorMsg
  });
}
var globalErrorHandler_default = errorHandler;

// src/modules/orders/orders.routes.ts
import { Router as Router4 } from "express";

// src/modules/orders/order.service.ts
var createOrder = async (userId, orderItems, shippingAddress, paymentMethod) => {
  if (orderItems.length === 0) {
    throw new Error("Order must contain at least one item");
  }
  const itemsBySeller = /* @__PURE__ */ new Map();
  for (const item of orderItems) {
    const medicineData = await prisma.medicines.findUnique({
      where: { id: item.medicineId },
      select: {
        id: true,
        price: true,
        name: true,
        stocks: true,
        userId: true
      }
    });
    if (!medicineData) {
      throw new Error(`Medicine not found: ${item.medicineId}`);
    }
    if (medicineData.stocks < item.quantity) {
      throw new Error(
        `Insufficient stocks. Available: ${medicineData.stocks}, Requested: ${item.quantity}`
      );
    }
    const itemTotal = Number(medicineData.price) * item.quantity;
    const sellerId = medicineData.userId;
    if (!itemsBySeller.has(sellerId)) {
      itemsBySeller.set(sellerId, { items: [], total: 0 });
    }
    const sellerGroup = itemsBySeller.get(sellerId);
    sellerGroup.items.push({
      medicineId: item.medicineId,
      quantity: item.quantity,
      price: Number(medicineData.price)
    });
    sellerGroup.total += itemTotal;
  }
  const result = await prisma.$transaction(async (tx) => {
    const orders = [];
    for (const [sellerId, { items, total }] of itemsBySeller) {
      const order = await tx.orders.create({
        data: {
          userId,
          totalAmount: total,
          paymentMethod,
          shippingAddress,
          orderItems: {
            create: items
          }
        },
        include: {
          orderItems: {
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  seller: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
      orders.push(order);
    }
    for (const item of orderItems) {
      await tx.medicines.update({
        where: { id: item.medicineId },
        data: { stocks: { decrement: item.quantity } }
      });
    }
    return orders;
  });
  return result;
};
var getUserOrders = async (userId) => {
  const result = await prisma.orders.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const total = await prisma.orders.count({
    where: { userId }
  });
  return { result, meta: { total } };
};
var getOrderDetails = async (orderId, userId) => {
  const result = await prisma.orders.findUnique({
    where: {
      id: orderId,
      userId
    },
    include: {
      orderItems: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        }
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  if (!result) {
    throw new Error("Order not found");
  }
  return result;
};
var cancelOrder = async (orderId, userId) => {
  const orderData = await prisma.orders.findUniqueOrThrow({
    where: {
      id: orderId,
      userId
    },
    include: {
      orderItems: true
    }
  });
  if (orderData.status === "CANCELLED" /* CANCELLED */) {
    throw new Error("Order is already cancelled");
  }
  if (orderData.status === "DELIVERED" /* DELIVERED */) {
    throw new Error("Cannot cancel a delivered order");
  }
  if (orderData.status === "SHIPPED" /* SHIPPED */) {
    throw new Error("Cannot cancel a shipped order");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.orders.update({
      where: {
        id: orderId
      },
      data: { status: "CANCELLED" /* CANCELLED */ },
      include: {
        orderItems: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      }
    });
    for (const item of orderData.orderItems) {
      await tx.medicines.update({
        where: {
          id: item.medicineId
        },
        data: {
          stocks: {
            increment: item.quantity
          }
        }
      });
    }
    return updatedOrder;
  });
  return result;
};
var OrderService = {
  createOrder,
  getOrderDetails,
  getUserOrders,
  cancelOrder
};

// src/modules/orders/orders.controller.ts
var createOrder2 = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    if (!orderItems || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Order items and shipping address are required"
      });
    }
    const result = await OrderService.createOrder(
      userId,
      orderItems,
      shippingAddress,
      paymentMethod
    );
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getUserOrders2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    const result = await OrderService.getUserOrders(userId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getOrderDetails2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id: orderId } = req.params;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    const result = await OrderService.getOrderDetails(
      orderId,
      userId
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var cancelOrder2 = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const userId = req.user?.id;
    const { status } = req.body;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    if (status !== "CANCELLED" /* CANCELLED */) {
      return res.status(400).json({
        success: false,
        message: "Customers can only update order status to CANCELLED"
      });
    }
    const result = await OrderService.cancelOrder(orderId, userId);
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var OrderController = {
  createOrder: createOrder2,
  getUserOrders: getUserOrders2,
  getOrderDetails: getOrderDetails2,
  cancelOrder: cancelOrder2
};

// src/modules/orders/orders.routes.ts
var router4 = Router4();
router4.get(
  "/",
  authMiddleware_default("CUSTOMER" /* CUSTOMER */),
  OrderController.getUserOrders
);
router4.get(
  "/:id",
  authMiddleware_default("CUSTOMER" /* CUSTOMER */),
  OrderController.getOrderDetails
);
router4.post(
  "/",
  authMiddleware_default("CUSTOMER" /* CUSTOMER */),
  OrderController.createOrder
);
router4.patch(
  "/cancel/:id",
  authMiddleware_default("CUSTOMER" /* CUSTOMER */),
  OrderController.cancelOrder
);
var OrderRouter = router4;

// src/modules/admin/admin.routes.ts
import { Router as Router5 } from "express";

// src/types/enums/UserStatus.ts
var UserStatus = /* @__PURE__ */ ((UserStatus2) => {
  UserStatus2["ACTIVE"] = "ACTIVE";
  UserStatus2["INACTIVE"] = "INACTIVE";
  UserStatus2["BANNED"] = "BANNED";
  return UserStatus2;
})(UserStatus || {});

// src/modules/admin/admin.service.ts
var getAllUsers = async (payload) => {
  const result = await prisma.user.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: {
      role: {
        not: "ADMIN" /* ADMIN */
      }
    }
  });
  const total = await prisma.user.count({
    where: {
      role: { not: "ADMIN" /* ADMIN */ }
    }
  });
  return {
    result,
    meta: {
      page: payload.page,
      limit: payload.limit,
      total,
      totalPage: Math.ceil(total / payload.limit)
    }
  };
};
var updateUserStatus = async (userId, newStatus) => {
  const findUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!findUser) {
    throw new Error("User not found");
  }
  if (findUser.role === "ADMIN" /* ADMIN */) {
    throw new Error("Cannot update admin user status");
  }
  if (!Object.values(UserStatus).includes(newStatus)) {
    throw new Error(
      `Invalid status. Valid statuses are: ${Object.values(UserStatus).join(", ")}`
    );
  }
  const result = await prisma.user.update({
    where: {
      id: userId
    },
    data: { status: newStatus },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true
    }
  });
  return result;
};
var getAllTableStats = async () => {
  return await prisma.$transaction(
    async (tx) => {
      const [
        totalMedicines,
        activeMedicines,
        inactiveMedicines,
        totalOrders,
        totalReviews,
        totalUsers,
        sellerCount,
        buyerCount,
        totalViews,
        totalRevenue,
        outOfStock
      ] = await Promise.all([
        await tx.medicines.count(),
        await tx.medicines.count({ where: { isActive: true } }),
        await tx.medicines.count({ where: { isActive: false } }),
        await tx.orderItems.count(),
        await tx.reviews.count(),
        await tx.user.count(),
        await tx.user.count({ where: { role: "SELLER" } }),
        await tx.user.count({ where: { role: "USER" } }),
        await tx.medicines.aggregate({ _sum: { views: true } }),
        await tx.medicines.aggregate({ _sum: { price: true } }),
        await tx.medicines.count({ where: { stocks: { lte: 0 } } })
      ]);
      return {
        totalMedicines,
        activeMedicines,
        inactiveMedicines,
        totalOrders,
        totalReviews,
        totalUsers,
        sellerCount,
        buyerCount,
        totalViews: totalViews._sum.views || 0,
        totalRevenue: Number(totalRevenue._sum.price) || 0,
        outOfStock
      };
    },
    {
      timeout: 15e3,
      maxWait: 5e3
    }
  );
};
var AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllTableStats
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginationAndSorting_default(req.query);
    const result = await AdminService.getAllUsers({ page, limit, skip });
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateUserStatus2 = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const { status } = req.body;
    const result = await AdminService.updateUserStatus(
      userId,
      status
    );
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllTableStats2 = async (req, res) => {
  try {
    const result = await AdminService.getAllTableStats();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Statistics fetched failed!";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var AdminController = {
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  getAllTableStats: getAllTableStats2
};

// src/modules/admin/admin.routes.ts
var router5 = Router5();
router5.get(
  "/users",
  authMiddleware_default("ADMIN" /* ADMIN */),
  AdminController.getAllUsers
);
router5.get(
  "/getAllTableStats",
  authMiddleware_default("ADMIN" /* ADMIN */),
  AdminController.getAllTableStats
);
router5.patch(
  "/users/:id",
  authMiddleware_default("ADMIN" /* ADMIN */),
  AdminController.updateUserStatus
);
var AdminRouter = router5;

// src/modules/medicines/medicines.routes.ts
import { Router as Router6 } from "express";

// src/modules/medicines/medicines.service.ts
var getAllMedicines = async (payload) => {
  const andConditions = [];
  if (payload.search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: payload.search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: payload.search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (typeof payload.isActive === "boolean") {
    andConditions.push({
      isActive: payload.isActive
    });
  }
  if (payload.userId) {
    andConditions.push({
      userId: payload.userId
    });
  }
  const result = await prisma.medicines.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: {
      AND: andConditions
    },
    orderBy: { [payload.sortBy]: payload.sortOrder },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      _count: {
        select: {
          reviews: true
        }
      }
    }
  });
  const total = await prisma.medicines.count({
    where: {
      AND: andConditions
    }
  });
  const transformedResult = result.map((medicine) => ({
    ...medicine,
    price: Number(medicine.price)
  }));
  return {
    response: transformedResult,
    meta: {
      page: payload.page,
      limit: payload.limit,
      total,
      totalPage: Math.ceil(total / payload.limit)
    }
  };
};
var getMedicinebyId = async (medicineId) => {
  return await prisma.$transaction(
    async (tx) => {
      const medicineData = await tx.medicines.findUnique({
        where: {
          id: medicineId
        },
        include: {
          reviews: {
            orderBy: { createdAt: "desc" },
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          },
          seller: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              reviews: true,
              orderItems: true
            }
          }
        }
      });
      if (!medicineData) {
        throw new Error("Medicine not found");
      }
      await tx.medicines.update({
        where: {
          id: medicineId
        },
        data: {
          views: { increment: 1 }
        }
      });
      return {
        ...medicineData,
        price: Number(medicineData.price)
      };
    },
    {
      timeout: 15e3,
      maxWait: 5e3
    }
  );
};
var getIsFeaturedMedicine = async () => {
  const result = await prisma.medicines.findMany({
    where: {
      isFeatured: true,
      isActive: true,
      stocks: { gt: 0 }
    },
    take: 10,
    orderBy: [{ views: "desc" }, { createdAt: "desc" }],
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      reviews: {
        select: {
          rating: true
        }
      },
      _count: {
        select: {
          reviews: true
        }
      }
    }
  });
  const transformedResult = result.map((medicine) => {
    const totalRating = medicine.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const averageRating = medicine.reviews.length > 0 ? totalRating / medicine.reviews.length : 0;
    return {
      id: medicine.id,
      name: medicine.name,
      description: medicine.description,
      price: Number(medicine.price),
      stocks: medicine.stocks,
      thumbnail: medicine.thumbnail,
      manufacturer: medicine.manufacturer,
      isActive: medicine.isActive,
      isFeatured: medicine.isFeatured,
      views: medicine.views,
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt,
      category: medicine.category,
      seller: medicine.seller,
      reviewCount: medicine._count.reviews,
      averageRating: Math.round(averageRating * 100) / 100
    };
  });
  return transformedResult;
};
var getTopViewedMedicine = async () => {
  const result = await prisma.medicines.findMany({
    where: {
      isActive: true,
      stocks: { gt: 0 }
    },
    take: 10,
    orderBy: [{ views: "desc" }, { createdAt: "desc" }],
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      reviews: {
        select: {
          rating: true
        }
      },
      _count: {
        select: {
          reviews: true,
          orderItems: true
        }
      }
    }
  });
  const transformedResult = result.map((medicine) => {
    const totalRating = medicine.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const averageRating = medicine.reviews.length > 0 ? totalRating / medicine.reviews.length : 0;
    return {
      id: medicine.id,
      name: medicine.name,
      description: medicine.description,
      price: Number(medicine.price),
      stocks: medicine.stocks,
      thumbnail: medicine.thumbnail,
      manufacturer: medicine.manufacturer,
      isActive: medicine.isActive,
      isFeatured: medicine.isFeatured,
      views: medicine.views,
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt,
      category: medicine.category,
      seller: medicine.seller,
      reviewCount: medicine._count.reviews,
      totalSales: medicine._count.orderItems,
      averageRating: Math.round(averageRating * 100) / 100
    };
  });
  return transformedResult;
};
var MedicinesService = {
  getAllMedicines,
  getMedicinebyId,
  getIsFeaturedMedicine,
  getTopViewedMedicine
};

// src/modules/medicines/medicines.controller.ts
var getAllMedicines2 = async (req, res, next) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const isActive = req.query.isActive ? req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : void 0 : void 0;
    const userId = req.query.userId;
    const { page, limit, skip, sortBy, sortOrder } = paginationAndSorting_default(
      req.query
    );
    const result = await MedicinesService.getAllMedicines({
      search: searchString,
      isActive,
      userId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMedicinebyId2 = async (req, res, next) => {
  try {
    const { id: medicineId } = req.params;
    if (!medicineId) {
      throw new Error("Medicine id is requird");
    }
    const result = await MedicinesService.getMedicinebyId(medicineId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getIsFeaturedMedicine2 = async (req, res, next) => {
  try {
    const result = await MedicinesService.getIsFeaturedMedicine();
    res.status(200).json({
      success: true,
      message: "Featured medicines retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getTopViewedMedicine2 = async (req, res, next) => {
  try {
    const result = await MedicinesService.getTopViewedMedicine();
    res.status(200).json({
      success: true,
      message: "Top viewed medicines retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var MedicinesController = {
  getAllMedicines: getAllMedicines2,
  getMedicinebyId: getMedicinebyId2,
  getIsFeaturedMedicine: getIsFeaturedMedicine2,
  getTopViewedMedicine: getTopViewedMedicine2
};

// src/modules/medicines/medicines.routes.ts
var router6 = Router6();
router6.get("/", MedicinesController.getAllMedicines);
router6.get("/isFeatured", MedicinesController.getIsFeaturedMedicine);
router6.get("/topViewed-medicine", MedicinesController.getTopViewedMedicine);
router6.get("/:id", MedicinesController.getMedicinebyId);
var MedicinesRouter = router6;

// src/middlewares/notFound.ts
var notFound = (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    date: Date()
  });
};

// src/modules/reviews/reviews.routes.ts
import { Router as Router7 } from "express";

// src/modules/reviews/reviews.service.ts
var createReview = async (userId, payload) => {
  const { medicineId, rating, comment } = payload;
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  const medicine = await prisma.medicines.findUnique({
    where: { id: medicineId },
    select: { id: true, name: true }
  });
  if (!medicine) {
    throw new Error("Medicine not found");
  }
  const existingReview = await prisma.reviews.findFirst({
    where: {
      userId,
      medicineId
    }
  });
  if (existingReview) {
    throw new Error("You have already reviewed this medicine");
  }
  const result = await prisma.reviews.create({
    data: {
      userId,
      medicineId,
      rating,
      comment
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      medicine: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  return result;
};
var deleteReview = async (reviewId, userId) => {
  const existingReview = await prisma.reviews.findFirst({
    where: {
      id: reviewId,
      userId
    }
  });
  if (!existingReview) {
    throw new Error(
      "Review not found or you don't have permission to delete it"
    );
  }
  await prisma.reviews.delete({
    where: {
      id: reviewId
    }
  });
  return { message: "Review deleted successfully" };
};
var ReviewService = {
  createReview,
  deleteReview
};

// src/modules/reviews/reviews.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const user = req.user;
    const { medicineId, rating, comment } = req.body;
    if (!user) {
      throw new Error("You are not authorized");
    }
    const result = await ReviewService.createReview(user.id, {
      medicineId,
      rating,
      comment
    });
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteReview2 = async (req, res, next) => {
  try {
    const { id: reviewId } = req.params;
    const user = req.user;
    if (!user) {
      throw new Error("You are not authorized");
    }
    const result = await ReviewService.deleteReview(
      reviewId,
      user.id
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var ReviewController = {
  createReview: createReview2,
  deleteReview: deleteReview2
};

// src/modules/reviews/reviews.routes.ts
var router7 = Router7();
router7.post(
  "/",
  authMiddleware_default("CUSTOMER" /* CUSTOMER */),
  ReviewController.createReview
);
router7.delete(
  "/:id",
  authMiddleware_default("CUSTOMER" /* CUSTOMER */),
  ReviewController.deleteReview
);
var ReviewRouter = router7;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: config_default.APP_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Medica - Medicine Management System API",
    description: "A comprehensive medicine management system for sellers and customers",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      medicines: "/api/medicines",
      orders: "/api/orders",
      seller: "/api/seller",
      admin: "/api/admin",
      categories: "/api/category",
      reviews: "/api/reviews"
    },
    features: {
      medicines: [
        "Browse all medicines",
        "Get featured medicines",
        "Get top viewed medicines",
        "Medicine details with reviews"
      ],
      seller: [
        "Medicine management",
        "Order management",
        "Sales statistics",
        "Inventory tracking"
      ],
      customer: [
        "Place orders",
        "Order history",
        "Cancel orders",
        "Product reviews"
      ],
      admin: [
        "User management",
        "System statistics",
        "Featured medicine control"
      ]
    },
    documentation: "Contact developer for API documentation"
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
app.use(globalErrorHandler_default);
app.use(notFound);
var app_default = app;

// src/server.ts
var port = config_default.port;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connection with database successful");
    app_default.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  } catch (error) {
    console.error("An error occur", error);
    prisma.$disconnect();
    process.exit(1);
  }
}
main();
