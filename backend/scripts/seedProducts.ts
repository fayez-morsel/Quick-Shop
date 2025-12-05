import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Product } from "../src/models/Product.js";
import { Store } from "../src/models/Store.js";
import { User } from "../src/models/User.js";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment");
}

const categories = ["Tech", "Home", "Sport", "Accessories", "Books", "Gifts"];

async function ensureStore() {
  let store = await Store.findOne();
  if (store) return store;

  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await User.create({
    name: "Seed Seller",
    email: "seed-seller@quickshop.test",
    passwordHash,
    role: "seller",
  });

  store = await Store.create({
    name: "Seed Seller Store",
    owner: user._id,
    email: user.email,
    category: "General",
    approved: true,
    status: "approved",
  });

  return store;
}

async function run() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to DB");

  const store = await ensureStore();
  console.log(`Using store: ${store.name} (${store._id})`);

  const products = Array.from({ length: 100 }).map((_, idx) => {
    const num = idx + 1;
    const category = categories[idx % categories.length];
    const price = Math.round((20 + Math.random() * 200) * 100) / 100;
    const compareAtPrice =
      Math.random() > 0.5 ? Math.round((price * 1.2) * 100) / 100 : undefined;
    const stock = Math.floor(Math.random() * 50) + 1;
    return {
      title: `Seed Product ${num}`,
      price,
      compareAtPrice,
      store: store._id,
      category,
      image: `https://picsum.photos/seed/qs-${num}/600/600`,
      inStock: stock > 0,
      stock,
      rating: { value: 0, count: 0 },
    };
  });

  await Product.insertMany(products);
  console.log("Inserted 100 products");

  await mongoose.disconnect();
  console.log("Done");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
