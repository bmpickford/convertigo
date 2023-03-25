import express from "express";
import * as zod from "zod";

export const loggingMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const start = new Date();

  res.on("finish", () => {
    const end = new Date();
    console.log(
      `[${end.toISOString()}] ${end.getTime() - start.getTime()}ms ${
        req.method
      } ${req.url} ${res.statusCode}`
    );
  });

  next();
};

export const errorHandlingMiddleware = (
  err: Error | zod.ZodError,
  req: any,
  res: any,
  next: any
) => {
  if (err instanceof zod.ZodError) {
    return res.status(400).send({ status: "error", issues: err.issues });
  }
  console.error(err.stack);
  res.status(500).send("Something went wrong");
};
