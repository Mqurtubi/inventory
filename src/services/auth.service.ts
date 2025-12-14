import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import type { Register, Login } from "../types/auth.type.js";
import { signJwt } from "../utils/jwt.js";
import { use } from "react";
export const authService = {
  async register(data: Register) {
    const existEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existEmail) {
      throw new ApiError(400, "email has been register");
    }
    const hashPassword = await bcrypt.hash(data.passwordHash, 10);

    const createUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashPassword,
      },
    });
    const token = signJwt({ id: createUser.id });

    return { createUser, token };
  },

  async login(data: Login) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new ApiError(400, "Email or password wrong");
    }
    const hashPassword = bcrypt.compare(data.passwordHash, user.passwordHash);
    if (!hashPassword) {
      throw new ApiError(400, "Email or password wrong");
    }
    const token = signJwt({ id: user.id });
    return { user, token };
  },
};
