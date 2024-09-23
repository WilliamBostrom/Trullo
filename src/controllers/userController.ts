import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import AppError from "../middlewares/AppError";
import User, { IUser } from "../models/userModel";

const filterObj = (obj: { [key: string]: any }, ...allowedFields: string[]) => {
  const newObj: { [key: string]: any } = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Hämta alla användare
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users: IUser[] = await User.find({});
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  }
);

export const updateMe = asyncHandler(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // 1) Skapa ett felmeddelande om användaren skickar lösenord
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }

    // 2) Filtrera ut fält som inte är tillåtna att uppdatera
    const filteredBody = filterObj(req.body, "name", "email");

    // 3) Uppdatera användarens dokument
    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export const deleteMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user?.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

// Hämta en specifik användare
export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: { user },
    });
  }
);

// Skapa en ny användare
export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: { newUser },
    });
  }
);

// Uppdatera en användare
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: { user },
    });
  }
);

// Ta bort en användare
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
