import { type Document, Types } from "mongoose";
export type OrderStatus = "Pending" | "Processing" | "Dispatched" | "Shipped" | "Delivered" | "Delivery Unsuccessful" | "Canceled";
export interface IOrderItem {
    product: Types.ObjectId;
    title: string;
    price: number;
    quantity: number;
    image: string;
}
export interface IOrder extends Document {
    buyer: Types.ObjectId;
    store: Types.ObjectId;
    items: IOrderItem[];
    status: OrderStatus;
    total: number;
    placedAt: Date;
    updatedAt: Date;
    updateHistory?: Array<{
        status: OrderStatus;
        changedAt: Date;
    }>;
}
export declare const Order: import("mongoose").Model<IOrder, {}, {}, {}, Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IOrder>;
//# sourceMappingURL=Order.d.ts.map