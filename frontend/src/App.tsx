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
    </div>
  );
}
