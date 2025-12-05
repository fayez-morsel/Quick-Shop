import { type Document, Types } from "mongoose";
export interface IFavorite extends Document {
    user: Types.ObjectId;
    product: Types.ObjectId;
    createdAt: Date;
}
export declare const Favorite: import("mongoose").Model<IFavorite, {}, {}, {}, Document<unknown, {}, IFavorite, {}, import("mongoose").DefaultSchemaOptions> & IFavorite & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IFavorite>;
//# sourceMappingURL=Favorite.d.ts.map