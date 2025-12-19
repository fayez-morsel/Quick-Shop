import { Types } from "mongoose";
import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
export const getReviews = async (req, res) => {
    const { productId } = req.params;
    const productObjectId = new Types.ObjectId(productId);
    const reviews = await Review.find({ product: productObjectId })
        .populate("user", "name email")
        .populate("order", "_id placedAt");
    res.json(reviews);
};
export const addReview = async (req, res) => {
    const { productId, orderId, rating, comment } = req.body;
    let attemptedIndexFix = false;
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            if (!productId || !Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: "Invalid product" });
            }
            if (!orderId || !Types.ObjectId.isValid(orderId)) {
                return res.status(400).json({ error: "Invalid order" });
            }
            if (typeof rating !== "number" || rating < 1 || rating > 5) {
                return res.status(400).json({ error: "Rating must be between 1 and 5" });
            }
            const productObjectId = new Types.ObjectId(productId);
            const orderObjectId = new Types.ObjectId(orderId);
            const userId = req.user.userId;
            const productExists = await Product.exists({ _id: productObjectId });
            if (!productExists) {
                return res.status(404).json({ error: "Product not found" });
            }
            // Ensure user purchased the product
            const order = await Order.findOne({
                buyer: userId,
                status: "Delivered",
                _id: orderObjectId,
                "items.product": productObjectId
            });
            if (!order) {
                return res
                    .status(400)
                    .json({ error: "You can only review delivered orders that include this product." });
            }
            const review = await Review.findOneAndUpdate({ user: userId, product: productObjectId, order: orderObjectId }, {
                $set: { rating, comment },
                $setOnInsert: { user: userId, product: productObjectId, order: orderObjectId },
            }, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }).populate("user", "name email");
            const reviews = await Review.find({ product: productObjectId });
            const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
            const avg = reviews.length ? totalRating / reviews.length : 0;
            await Product.findByIdAndUpdate(productObjectId, {
                rating: { value: avg, count: reviews.length }
            });
            return res.json({ message: "Review saved", review });
        }
        catch (err) {
            const dup = err?.code === 11000;
            if (dup) {
                const msg = err?.message ?? "";
                if (!attemptedIndexFix && msg.includes("product_1_user_1")) {
                    attemptedIndexFix = true;
                    try {
                        await Review.collection.dropIndex("product_1_user_1");
                        continue;
                    }
                    catch (dropErr) {
                        console.error("Failed dropping legacy review index", dropErr);
                    }
                }
                return res.status(400).json({
                    error: "You already reviewed this order for this product."
                });
            }
            console.error("addReview error", err);
            return res.status(500).json({ error: "Failed to save review" });
        }
    }
};
//# sourceMappingURL=reviewController.js.map