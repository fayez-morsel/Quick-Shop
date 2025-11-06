import { useStore } from "../store/useStore";

export default function Filters() {
  const query = useStore((s) => s.filters.query);
  const sortBy = useStore((s) => s.filters.sortBy);
  const discountedOnly = useStore((s) => s.filters.discountedOnly);

  const setQuery = useStore((s) => s.setQuery);
  const setSort = useStore((s) => s.setSort);
  const setDiscounted = useStore((s) => s.setDiscounted);

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-md shadow-sm mb-6">
        {/* Search box */}
        <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="flex-1 min-w-[180px] rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
  )
}