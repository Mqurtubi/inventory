import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("jwt secret missing");
}

const signJwt = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "1d" });
};

const verifyJwt = (token: string) => {
  return jwt.verify(token, JWT_SECRET!);
};

export { signJwt, verifyJwt };
