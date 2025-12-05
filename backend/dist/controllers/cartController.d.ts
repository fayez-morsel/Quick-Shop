import type { Response } from "express";
import type { AuthReq } from "../middleware/auth.js";
export declare const getCart: (req: AuthReq, res: Response) => Promise<void>;
export declare const addToCart: (req: AuthReq, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCartItem: (req: AuthReq, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const removeCartItem: (req: AuthReq, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=cartController.d.ts.map