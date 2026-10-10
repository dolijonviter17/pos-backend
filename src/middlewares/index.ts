import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";
import { ApiError } from "../error/apiError";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string | undefined;

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["JONVITER-AUTH"];
    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const errorMiddleware = async (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!err) {
    next()
    return
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message
    }).end()
  } else {
    res.status(500).json({
      status: 500,
      message: err.message
    }).end()
  }
}
