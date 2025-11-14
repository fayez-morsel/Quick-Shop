import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import OrderConfirmation from "./components/OrderConfirmation";
import ProductPage from "./pages/ProductPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import SupportPage from "./pages/SupportPage";
import SellerDashboard from "./pages/SellerDashboard";

export default function App() {
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleCheckoutComplete = () => setConfirmationOpen(true);
  const handleCloseConfirmation = () => setConfirmationOpen(false);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-[#dfeeff] font-sans text-slate-900">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/seller" element={<SellerDashboard />} />
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
