import type { Response,Request,NextFunction } from "express"
import { ApiError } from "../utils/ApiError.js"
import { verifyJwt } from "../utils/jwt.js"
export const auth = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const header = req.headers.authorization
        if(!header || !header.startsWith("Bearer ")){
            throw new ApiError(401,"unauthorized")
        }
        const token = header.split(" ")[1]
        const payload =verifyJwt(token!)

        req.user= payload as any
        next()
    } catch (error) {
        throw (new ApiError(401,"token invalid"))
    }
}