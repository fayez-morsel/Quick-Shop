import { Star } from "lucide-react";
type RatingProps = {
  value: number;
  count: number;
};

export default function Rating({ value, count }: RatingProps) {
  return (
    <div
      className="inline-flex items-center gap-3 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-blue-100"
      aria-label={`Rating ${value.toFixed(1)} out of 5 from ${count} reviews`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-500">
        <Star className="h-4 w-4" aria-hidden />
      </span>
      <span className="text-base">{value.toFixed(1)}</span>
      <span className="text-xs font-medium text-slate-500">({count})</span>
    </div>
  );
}
