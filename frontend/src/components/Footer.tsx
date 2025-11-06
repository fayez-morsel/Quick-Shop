export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="mx-auto max-w-6xl px-4 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} QuickShop. All rights reserved.
      </div>
    </footer>
  );
}
