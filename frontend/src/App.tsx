export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 test-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">QuickShop</h1>
          <nav className="space-x-4 text-sm font-medium text-gray-600">
            <button className="hover:text-blue-600">Home</button>
            <button className="hover:text-blue-600">Products</button>
            <button className="hover:text-blue-600">Cart</button>
          </nav>
        </div>
      </header>
      {/* Main */}
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8">
        <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* placeholder product cards */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-2"
            >
              <div className="aspect-4/3 bg-gray-200 rounded" />
              <h2 className="text-base font-semibold">Product {i + 1}</h2>
              <p className="text-gray-500 text-sm">$99.00</p>
              <button className="mt-auto bg-blue-600 text-white rounded-md py-1.5 hover:bg-blue-700 transition">
                Add to cart
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
