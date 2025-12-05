import { type Document, Types } from "mongoose";
export type StoreStatus = "pending" | "approved" | "rejected";
export interface IStore extends Document {
    name: string;
    owner: Types.ObjectId;
    email: string;
    category: string;
    description?: string;
    approved: boolean;
    status: StoreStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Store: import("mongoose").Model<IStore, {}, {}, {}, Document<unknown, {}, IStore, {}, import("mongoose").DefaultSchemaOptions> & IStore & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IStore>;
//# sourceMappingURL=Store.d.ts.map