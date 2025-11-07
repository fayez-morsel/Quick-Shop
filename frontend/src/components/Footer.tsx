export default function Footer() {
  return (
    <footer className="bg-blue-800 text-blue-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Brand */}
        <div>
          <h3 className="font-semibold text-white text-lg mb-2">ShopHub</h3>
          <p className="text-blue-200 text-sm">
            Your trusted marketplace for modern shopping — verified sellers,
            fast delivery, and secure payments.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Shop
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
