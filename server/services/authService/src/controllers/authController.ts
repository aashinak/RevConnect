// authController.ts

import { NextFunction, Request, Response } from "express";
import registerUser from "../usecases/registerUser";
import { ApiError } from "../utils/ApiError";
import { validationResult } from "express-validator";
import cleanUpAvatar from "../utils/cleanUpAvatar";
import logger from "../utils/logger";

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  const avatar = req.file?.path;
  if (!errors.isEmpty()) {
   logger.warn(`Validation error ::: ${errors.array().map(error => error.msg)}`)
   cleanUpAvatar(avatar as string)
   throw new ApiError(400, 'Validation Error', errors.array().map(error => error.msg));
  }

  const { name, email, password } = req.body;


  if (!avatar) {
    throw new ApiError(400, "Avatar file is required"); 
  }

  const user = await registerUser(name, email, password, avatar);
  
  
  res.status(201).json({ user });
};

export { register };
