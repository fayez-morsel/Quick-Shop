import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import OrderConfirmation from "./components/OrderConfirmation";

export default function App() {
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleCheckoutComplete = () => setConfirmationOpen(true);
  const handleCloseConfirmation = () => setConfirmationOpen(false);

  return (
    <BrowserRouter>
      <div
        className="flex flex-col min-h-screen"
        style={{
          background: "linear-gradient(180deg, var(--bg-main), var(--bg-card))",
          color: "var(--text-main)",
        }}
      >
        <Header />
        <main className="flex-1 px-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Footer />
        <Cart onCheckoutComplete={handleCheckoutComplete} />
        <OrderConfirmation
          open={confirmationOpen}
          onClose={handleCloseConfirmation}
        />
      </div>
    </BrowserRouter>
  );
}
