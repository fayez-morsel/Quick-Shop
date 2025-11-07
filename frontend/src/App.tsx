import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-main) 0%, var(--bg-card) 100%)",
        color: "var(--text-main)",
      }}
    >
      <Header />
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8">
        <HomePage />
      </main>
      <Footer />
      <Cart />
    </div>
  );
}
