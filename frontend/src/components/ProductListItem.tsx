import { memo, useMemo, type ReactNode } from "react";
import { useProductStore } from "../store";
import { money } from "../utils/format";

type Props = {
  productId: string;
  quantity?: number;
  fallbackTitle?: string;
  footer?: ReactNode;
};

function ProductListItemComponent({ productId, quantity = 1, fallbackTitle, footer }: Props) {
  const product = useProductStore((s) => s.productsMap[productId]);

  const display = useMemo(() => {
    if (!product) return { title: fallbackTitle ?? productId, price: 0, image: "" };
    const images = product.images && product.images.length ? product.images : product.image ? [product.image] : [];
    return {
      title: product.title,
      price: product.price,
      image: images[0] ?? product.image ?? "",
      product,
    };
  }, [fallbackTitle, product, productId]);

  return (
    <div className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm md:grid-cols-[72px_minmax(0,1fr)_auto]">
      {display.image ? (
        <img
          src={display.image}
          alt={display.title}
          className="h-16 w-16 rounded-xl object-cover md:h-14 md:w-14"
        />
      ) : (
        <div className="grid h-14 w-14 place-items-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-500">
          IMG
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-slate-900">
          {display.title}
        </p>
        <p className="text-xs text-slate-500">
          Qty: {quantity}
        </p>
        {footer}
      </div>
      <div className="flex items-center justify-end text-sm font-semibold text-slate-800 md:flex-col md:items-end md:gap-1">
        <span>{money(display.price * quantity)}</span>
      </div>
    </div>
  );
}

const ProductListItem = memo(ProductListItemComponent);
export default ProductListItem;
