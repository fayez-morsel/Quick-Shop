import type { Brand, Product } from "../types";

const fallbackBrands = [
  "Tech Hub",
  "KeyZone",
  "SoundWave",
  "DataHub",
  "ErgoWorks",
  "HomeLight",
  "Store",
] as const;

export const looksLikeObjectId = (value: unknown) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

const pickDeterministicBrand = (input: string): string => {
  if (!input) return fallbackBrands[0];
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return fallbackBrands[hash % fallbackBrands.length];
};

export const normalizeProduct = (product: any): Product => {
  const rawStoreName = product.storeName ?? product.store?.name ?? product.store ?? "";
  const storeName = looksLikeObjectId(rawStoreName) ? product.store?.name ?? "Store" : rawStoreName;
  const rawBrand = product.brand ?? storeName;
  const brandBase = looksLikeObjectId(rawBrand) || !rawBrand ? storeName : rawBrand;
  const brand = (brandBase && brandBase.trim().length ? brandBase : pickDeterministicBrand(product._id ?? product.id ?? storeName)) as Brand;
  const compareAt = typeof product.compareAtPrice === "number" ? product.compareAtPrice : undefined;
  const discounted =
    typeof compareAt === "number" && typeof product.price === "number"
      ? compareAt > product.price
      : Boolean(product.discounted);

  const normalized: Product = {
    ...product,
    _id: product._id ?? product.id ?? "",
    id: product._id ?? product.id ?? "",
    image: product.image ?? product.images?.[0] ?? "",
    inStock:
      typeof product.inStock === "boolean"
        ? product.inStock
        : product.stock > 0 || product.stock === undefined,
    stock: product.stock ?? 0,
    storeName,
    brand,
    storeId: product.storeId ?? product.store ?? "",
    discounted,
  };
  return normalized;
};

export const arrayToMap = <T extends { id?: string; _id?: string }>(
  list: T[]
): Record<string, T> => {
  return list.reduce<Record<string, T>>((acc, item) => {
    const key = (item as any)._id ?? (item as any).id;
    if (key) {
      acc[key] = item;
    }
    return acc;
  }, {});
};
