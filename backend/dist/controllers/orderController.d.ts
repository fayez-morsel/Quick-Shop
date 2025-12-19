import type { Response } from "express";
import type { AuthReq } from "../middleware/auth.js";
export declare const placeOrder: (req: AuthReq, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getOrdersForBuyer: (req: AuthReq, res: Response) => Promise<void>;
export declare const getOrdersForSeller: (req: AuthReq, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateOrderStatus: (req: AuthReq, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const confirmOrder: (req: AuthReq, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=orderController.d.ts.map