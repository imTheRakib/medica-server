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

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMsg = "You have provided incorrect field or missing fields";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
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
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMsg = "Error occurred during query execution";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMsg = "Prisma engine crashed";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMsg = "Authentication failed. Please check your credentials!";
    } else if (err.errorCode === "P1001") {
      statusCode = 500;
      errorMsg = "Can't reach database server";
    }
  }
  // Handle customeerr
  else if (err instanceof Error && err.message) {
    // Check error message patterns
    if (err.message.toLowerCase().includes("not found")) {
      statusCode = 404;
      errorMsg = err.message;
    } else if (
      err.message.includes("Cannot update") ||
      err.message.includes("Invalid status") ||
      err.message.includes("Invalid") ||
      err.message.includes("required") ||
      err.message.includes("must contain")
    ) {
      statusCode = 400;
      errorMsg = err.message;
    } else if (
      err.message.includes("unauthorized") ||
      err.message.includes("permission") ||
      err.message.includes("not authorized")
    ) {
      statusCode = 403;
      errorMsg = err.message;
    } else {
      statusCode = 400;
      errorMsg = err.message;
    }
  }

  res.status(statusCode).json({
    success: false,
    message: errorMsg,
  });
}

export default errorHandler;
