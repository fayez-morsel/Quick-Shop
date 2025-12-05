import { type Document, Types } from "mongoose";
export interface IProduct extends Document {
    title: string;
    price: number;
    compareAtPrice?: number;
    store: Types.ObjectId;
    brand?: string;
    category: string;
    image: string;
    inStock: boolean;
    stock: number;
    rating: {
        value: number;
        count: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const Product: import("mongoose").Model<IProduct, {}, {}, {}, Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IProduct>;
//# sourceMappingURL=Product.d.ts.map