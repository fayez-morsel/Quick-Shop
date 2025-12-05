import type { Response } from "express";
import type { AuthReq } from "../middleware/auth.js";
export declare const getMyStore: (req: AuthReq, res: Response) => Promise<void>;
export declare const approveStore: (req: AuthReq, res: Response) => Promise<void>;
//# sourceMappingURL=storeController.d.ts.map