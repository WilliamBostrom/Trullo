import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import asyncHandler from "../middlewares/asyncHandler";
import AppError from "../middlewares/AppError";
import sendEmail from "../utils/email";

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
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      passwordResetToken: req.body.passwordResetToken,
      passwordResetExpires: req.body.passwordResetToken,
      active: req.body.active,
    });

    const token = signToken(newUser._id.toHexString());

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
    const token = signToken(user._id.toHexString());
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
    let token: string | undefined;
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

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // roles ['admin', 'user']. role='user'
    if (!roles.includes((req as any).user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

export const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. If you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) if token not expired, set new pw
    if (!user) {
      return next(new AppError("Token is invalid or expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //3) update changedPasswordAt

    // 4) Log in the user + send jwt
    const token = signToken(user._id.toString());

    res.status(200).json({
      status: "success",
      token,
    });
  }
);

export const updatePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user from collection
    const user = await User.findById(req.user?.id).select("password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }
    //  2) Check if POSTed current password i correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("Your current password is wrong.", 401));
    }
    // 3 If so, update pw
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) Log in send jwt token
    const token = signToken(user._id.toString());

    res.status(200).json({
      status: "success",
      token,
    });
  }
);
