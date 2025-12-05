import type { Response } from "express";
import type { AuthReq } from "../middleware/auth.js";
export declare const getReviews: (req: AuthReq, res: Response) => Promise<void>;
export declare const addReview: (req: AuthReq, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=reviewController.d.ts.map