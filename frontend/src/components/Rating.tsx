type RatingProps = {
  value: number;
  count: number;
};

export default function Rating({ value, count }: RatingProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-[#0d4bc9] dark:bg-slate-700 dark:text-blue-200">
      <span className="text-base leading-none text-amber-400">★</span>
      {value.toFixed(1)}
      <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
        ({count} reviews)
      </span>
    </div>
  );
}
