import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import bcrypt from "bcrypt";

interface UserModel {
  username: string;
  password?: string;
  name: string;
  email: string;
  generateToken: () => string;
}

interface UserMethods {
  generateToken: () => string;
  verifyPassword: (password: string) => Promise<boolean>;
}

type UserDocument = mongoose.HydratedDocument<UserModel, UserMethods>;

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

userSchema.methods.verifyPassword = async function (
  this: UserDocument,
  password: string,
) {
  if (!this.password) return false;

  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function (this: UserDocument) {
  return jwt.sign(
    { _id: this._id, username: this.username },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRY as any,
    },
  );
};

export const User = mongoose.model<UserDocument>("User", userSchema);
