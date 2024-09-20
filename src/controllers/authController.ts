import { Request, Response, NextFunction } from "express";
// import { promisify } from "util";
import jwt, { JwtPayload } from "jsonwebtoken";
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
    const newUser: IUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
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

// Skyddsmeddelande för att skydda rutter med JWT-autentisering
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Hämta token och kontrollera om den finns
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // 2) Verifiera token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // 3) Kontrollera om användaren finns
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    // 4) Kontrollera om användaren har ändrat sitt lösenord efter att JWT-token genererades
    if (freshUser.changedPasswordAfter(decoded.iat!)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    // 5) Tilldela användaren till req-objektet för framtida åtkomst
    req.user = freshUser;
    next();
  }
);
