import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMsg = "Internal Server Error";
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMsg = "You have provided incorrct field or missing fields";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 404;
      errorMsg =
        "An operation failed because it depends on one or more records that were required but not found";
    } else if (err.code === "P2002") {
      statusCode = 409;
      errorMsg = "Unique constraint failed";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMsg = "Foreign key constraint failed on the field";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMsg = "Error occurred during query execution";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMsg = "Prisma engine crashed";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMsg = "Authentication failed. Please check your creditials!";
    } else if (err.errorCode === "P1001") {
      statusCode = 400;
      errorMsg = "Can't reach database server";
    }
  }
  res.status(statusCode);
  res.json({
    success: false,
    message: errorMsg,
    error: errorDetails,
  });
}

export default errorHandler;
