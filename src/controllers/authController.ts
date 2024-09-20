import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import asyncHandler from "../middlewares/asyncHandler";
import AppError from "../middlewares/AppError";

// Funktion för att skapa en JWT-token
const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Signup-funktion
export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm } = req.body;

    const newUser: IUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    const token = signToken(newUser._id.toString());

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  }
);

// Login-funktion
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) Kontrollera om email och lösenord finns
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }
    // 2) Kontrollera om användaren finns och lösenordet är korrekt
    const user = (await User.findOne({ email }).select("+password")) as IUser;

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    // 3) Om allt stämmer, skicka tillbaka en JWT-token
    const token = signToken(user._id.toString());
    res.status(200).json({
      status: "success",
      token,
    });
  }
);
