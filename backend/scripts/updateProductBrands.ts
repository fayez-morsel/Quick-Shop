import "dotenv/config";
import { connectDB } from "../src/config/db.js";
import { Product } from "../src/models/Product.js";
import { Types } from "mongoose";

const BRANDS = [
  "Tech Hub",
  "KeyZone",
  "SoundWave",
  "DataHub",
  "ErgoWorks",
  "HomeLight",
  "Store",
] as const;

const pickBrand = (seed: string): (typeof BRANDS)[number] => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return BRANDS[hash % BRANDS.length] ?? "Store";
};

async function run() {
  await connectDB();
  const products = await Product.find({}, { _id: 1 }).lean();

  if (!products.length) {
    console.log("No products found to update.");
    process.exit(0);
  }

  const operations = products.map((p: { _id: Types.ObjectId }) => ({
    updateOne: {
      filter: { _id: p._id },
      update: { $set: { brand: pickBrand(p._id.toString()) } },
    },
  }));

  const result = await Product.bulkWrite(operations, { ordered: false });
  console.log(
    `Updated brands for ${result.modifiedCount ?? 0} products (matched ${
      result.matchedCount ?? 0
    }).`
  );
  process.exit(0);
}

run().catch((err) => {
  console.error("Failed updating product brands", err);
  process.exit(1);
});
