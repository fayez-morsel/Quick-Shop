import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
export interface AuthReq extends Request {
    user?: {
        userId: Types.ObjectId;
        role: "buyer" | "seller";
    };
}
export declare const auth: (req: AuthReq, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map