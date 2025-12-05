import { type Document, Types } from "mongoose";
export interface IReview extends Document {
    product: Types.ObjectId;
    user: Types.ObjectId;
    order: Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
}
export declare const Review: import("mongoose").Model<IReview, {}, {}, {}, Document<unknown, {}, IReview, {}, import("mongoose").DefaultSchemaOptions> & IReview & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IReview>;
//# sourceMappingURL=Review.d.ts.map