import express from "express";
import * as zod from "zod";
import { AnyEvent } from "./types.js";
import { v4 } from "uuid";
import { Noop } from "./db/index.js";
import { errorHandlingMiddleware, loggingMiddleware } from "./middleware.js";
import { getParsedBody } from "./util.js";

interface SuccessResponse {
  status: "ok";
}
interface ErrorResponse {
  status: "error";
  message?: string;
  issues?: zod.ZodIssue[];
}

type EventSaveResponse = SuccessResponse | ErrorResponse;
type EventSaveRequest = AnyEvent;

export const init = (db = new Noop()) => {
  const app = express();
  app.use(express.json());
  app.use(loggingMiddleware);

  app.post<"/event", never, EventSaveResponse, EventSaveRequest>(
    "/event",
    async (req, res, next) => {
      try {
        const parsedBody = getParsedBody(req.body);
        if (!parsedBody) {
          return res
            .status(400)
            .send({ status: "error", message: "Invalid event type" });
        }

        await db.save({
          ...parsedBody,
          id: v4(),
          timestamp: new Date().getTime(),
        });
        res.send({ status: "ok" });
      } catch (err) {
        next(err);
      }
    }
  );

  app.use(errorHandlingMiddleware);

  return app;
};
