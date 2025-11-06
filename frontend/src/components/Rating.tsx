export default function Rating({
  value,
  count,
}: {
  value: number;
  count: number;
}) {
  const full = Math.round(value);

  return (
    <div className="flex items-center gap-1 text-sm">
      {/* stars */}
      <div className="flex" aria-label={`${value} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={`h-4 w-4 ${
              i < full ? "fill-yellow-400" : "fill-gray-300"
            }`}
          >
            <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
          </svg>
        ))}
      </div>
      <span className="text-gray-500">({count})</span>
    </div>
  );
}
