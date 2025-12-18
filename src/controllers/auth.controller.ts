import type { Response, Request, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { signJwt } from "../utils/jwt.js";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createUser = await authService.register(req.body);
    res.status(201).json({
      message: "Register success",
      data: createUser,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginUser = await authService.login(req.body);
    const token = signJwt(loginUser);
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
     return res.json({
      message: "Login success",
      data: loginUser
    })
  } catch (error) {
    next(error);
  }
  
};

const me = async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const userId= req.user.id
    const user=await authService.me(userId)
    res.json({
      data:user
    })
  } catch (error) {
    next(error)
  }
}

const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    console.log(req.user?.role);

    const updateUser = await authService.update(id!, req.user?.role!, role);
    res.json({
      message: "Role updated successfully",
      data: updateUser,
    });
  } catch (error) {
    next(error);
  }
};
export { register, login, updateRole,me };
