import type { Response } from "express";
import type { AuthReq } from "../middleware/auth.js";
export declare const getAllProducts: (req: AuthReq, res: Response) => Promise<void>;
export declare const getProductById: (req: AuthReq, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createProduct: (req: AuthReq, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=productController.d.ts.map