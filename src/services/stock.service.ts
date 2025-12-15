import { Type } from "../../generated/prisma/enums.js";
import { prisma } from "../config/prisma.js";

export const stockService={
    async stockIn(productId:string, qty:number,userId:string){
        return prisma.$transaction(async (tx)=>{
            await tx.stockMovement.create({
                data: {
                    productId:productId,
                    userId:userId,
                    type:Type.IN,
                    qty:qty
                }
            }),
            await tx.product.update({
                where:{id:productId},
                data:{
                    currentStock:{decrement:qty}
                }
            })
        })
    },
    async stockOut(productId:string, qty:number,userId:string){
        return prisma.$transaction(async(tx)=>{
            await tx.stockMovement.create({
                data:{
                    productId:productId,
                    userId:userId,
                    type:Type.OUT,
                    qty:qty
                }
            })
            await tx.product.update({
                where:{id:productId},
                data:{
                    currentStock:{decrement:qty}
                }
            })
        })
    }
}