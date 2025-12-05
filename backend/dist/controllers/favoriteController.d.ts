import type { Response } from "express";
import type { AuthReq } from "../middleware/auth.js";
export declare const getFavorites: (req: AuthReq, res: Response) => Promise<void>;
export declare const toggleFavorite: (req: AuthReq, res: Response) => Promise<void>;
//# sourceMappingURL=favoriteController.d.ts.map