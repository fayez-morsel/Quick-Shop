export default function Footer() {
  return (
    <footer className="bg-[--color-primary-dark] text-blue-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
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
            <li><a href="#" className="hover:text-[--color-accent]">Home</a></li>
            <li><a href="#" className="hover:text-[--color-accent]">Shop</a></li>
            <li><a href="#" className="hover:text-[--color-accent]">About Us</a></li>
            <li><a href="#" className="hover:text-[--color-accent]">Contact</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-semibold text-white mb-3">Customer Service</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[--color-accent]">FAQs</a></li>
            <li><a href="#" className="hover:text-[--color-accent]">Returns</a></li>
            <li><a href="#" className="hover:text-[--color-accent]">Shipping Info</a></li>
            <li><a href="#" className="hover:text-[--color-accent]">Support</a></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="font-semibold text-white mb-3">Connect With Us</h4>
          <ul className="space-y-2">
            <li>📍 Lebanon</li>
            <li>📞 +961 81633369</li>
            <li>✉️ support@shophub.com</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
