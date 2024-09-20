import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>; // Typ för correctPassword
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Please provide your email"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "Please provide a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el): boolean {
        return el === this.password;
      },
      message: "Password are not the same",
    },
  },
});

userSchema.pre("save", async function (next): Promise<void> {
  if (!this.isModified("password")) return next();
  //Hash password
  this.password = await bcrypt.hash(this.password, 12);
  //Delete pwConfrim field
  this.passwordConfirm = undefined;
  next();
});

// correctPassword metod för att jämföra lösenord
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
