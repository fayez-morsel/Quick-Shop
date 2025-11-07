export default function Footer() {
  return (
    <footer
      className="mt-16 text-sm"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-footer) 0%, var(--color-primary-dark) 100%)",
        color: "var(--text-main)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-(--color-accent) text-lg mb-2">
            ShopHub
          </h3>
          <p className="text-(--text-secondary)">
            Your trusted marketplace for verified sellers, fast delivery, and
            secure payments.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-(--color-accent)">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {["Home", "Shop", "About Us", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="hover:text-(--color-accent) transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-(--color-accent)">
            Customer Service
          </h4>
          <ul className="space-y-2">
            {["FAQs", "Returns", "Shipping Info", "Support"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="hover:text-(--color-accent) transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-(--color-accent)">
            Connect
          </h4>
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
