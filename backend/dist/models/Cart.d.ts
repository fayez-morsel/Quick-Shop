import { type Document, Types } from "mongoose";
export interface ICartItem {
    product: Types.ObjectId;
    quantity: number;
}
export interface ICart extends Document {
    user: Types.ObjectId;
    items: ICartItem[];
    updatedAt: Date;
}
export declare const Cart: import("mongoose").Model<ICart, {}, {}, {}, Document<unknown, {}, ICart, {}, import("mongoose").DefaultSchemaOptions> & ICart & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, ICart>;
//# sourceMappingURL=Cart.d.ts.map