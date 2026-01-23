import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import type { Register, Login } from "../types/auth.type.js";
import { signJwt } from "../utils/jwt.js";
import { Role } from "../../generated/prisma/enums.js";

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
    const token = signJwt(createUser);

    return { createUser, token };
  },

  async login(data: Login) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new ApiError(400, "Email or password wrong");
    }
    const hashPassword = await bcrypt.compare(
      data.passwordHash,
      user.passwordHash,
    );
    if (!hashPassword) {
      throw new ApiError(400, "Email or password wrong");
    }
    return user;
  },
  async update(id: string, requestRole: Role, newRole: Role) {
    if (requestRole !== Role.ADMIN) {
      throw new ApiError(403, "forbidden");
    }
    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      throw new ApiError(404, "user not found");
    }
    return prisma.user.update({ where: { id }, data: { role: newRole } });
  },
  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    if (!user) {
      throw new ApiError(404, "user not found");
    }
    return user;
  },
};
