import { type Document, Types } from "mongoose";
export type UserRole = "buyer" | "seller";
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    store?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IUser>;
//# sourceMappingURL=User.d.ts.map