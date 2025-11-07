export default function Rating({
  value,
  count,
}: {
  value: number;
  count: number;
}) {
  const full = Math.round(value);

  return (
    <div className="flex items-center gap-1 text-sm select-none">
      <div className="flex" aria-label={`${value} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            width="16"
            height="16"
            fill={i < full ? "var(--color-accent)" : "var(--border-color)"}
            stroke={i < full ? "var(--color-accent)" : "var(--border-color)"}
            strokeWidth="0.5"
            className="transition-transform duration-300 group-hover:scale-110"
          >
            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
          </svg>
        ))}
      </div>
      <span
        className="text-xs"
        style={{ color: "var(--text-secondary)" }}
      >
        ({count})
      </span>
    </div>
  );
}
