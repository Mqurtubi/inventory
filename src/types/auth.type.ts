import type { Type } from "../../generated/prisma/enums.js";

interface Register {
  name: string;
  email: string;
  passwordHash: string;
}

interface Login {
  email: string;
  passwordHash: string;
}

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type { Register, Login, JwtPayload };
