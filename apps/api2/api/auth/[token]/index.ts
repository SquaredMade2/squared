import type { User } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";
import jwt from "jsonwebtoken";


type Params = {
  token: string;
};
type JwtPayload = {
    user: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

export function createRoute(): Route<Params>{
    return {
  
      POST: async (params: Params) => {
        const { token } = params;
        try{
            if (!JWT_SECRET) {
                return {
                data: {
                    user: null,
                    message: "JWT_SECRET is not defined.",
                    variant: "destructive",
                },
                };
            }
            if (token) {
                const decoded: JwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload
                    await prisma.user.update({
                        where: { id: decoded.user},
                        data: { verified: true},
                    })
                    return {
                        data: {
                          message: "User verified",
                          variant: "successful",
                        },
                      };
                };
        } catch (error) {
            console.error("Error with auth request:", error);
            return {
              data: {
                user: null,
                message: "Internal server error",
                variant: "destructive",
              },
            };
          }
        }
    } 
  }