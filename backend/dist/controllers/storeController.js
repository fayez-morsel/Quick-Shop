import { Types } from "mongoose";
import { Store } from "../models/Store.js";
export const getMyStore = async (req, res) => {
    const store = await Store.findOne({ owner: req.user.userId });
    res.json(store);
};
export const approveStore = async (req, res) => {
    const store = await Store.findByIdAndUpdate(new Types.ObjectId(req.params.id), { approved: true, status: "approved" }, { new: true });
    res.json(store);
};
//# sourceMappingURL=storeController.js.map