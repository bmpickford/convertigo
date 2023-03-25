import express from "express";
import * as zod from "zod";
import { AnyEvent } from "./types";
import { Noop } from "./db";
import { v4 } from "uuid";
import { errorHandlingMiddleware, loggingMiddleware } from "./middleware";
import { getParsedBody } from "./util";

interface SuccessResponse {
  status: "ok";
}
interface ErrorResponse {
  status: "error";
  message?: string;
  issues?: zod.ZodIssue[];
}

type Response = SuccessResponse | ErrorResponse;
type Request = AnyEvent;

export const init = (db = new Noop()) => {
  const app = express();
  app.use(express.json());
  app.use(loggingMiddleware);

  app.post<"/event", never, Response, Request>("/event", (req, res) => {
    const parsedBody = getParsedBody(req.body);
    if (!parsedBody) {
      return res
        .status(400)
        .send({ status: "error", message: "Invalid event type" });
    }

    db.save({ ...parsedBody, id: v4(), timestamp: new Date().getTime() });
    res.send({ status: "ok" });
  });

  app.use(errorHandlingMiddleware);

  return app;
};
