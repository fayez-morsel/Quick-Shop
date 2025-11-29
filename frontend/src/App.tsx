import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import OrderConfirmation from "./components/OrderConfirmation";
import ProductPage from "./pages/ProductPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import SupportPage from "./pages/SupportPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import SellerDashboard from "./pages/SellerDashboard";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import SellerProductsPage from "./pages/SellerProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useStore } from "./store/useStore";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const userName = useStore((s) => s.userName);
  const userEmail = useStore((s) => s.userEmail);
  const markOrderConfirmed = useStore((s) => s.markOrderConfirmed);
  const clearCart = useStore((s) => s.clearCart);

  const handleCheckoutComplete = (orderId?: string) => {
    if (!orderId) {
      return;
    }
    setPendingOrderId(orderId);
    setConfirmationOpen(true);
  };
  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    setPendingOrderId(null);
  };

  const showFooter =
    !location.pathname.startsWith("/seller") && !location.pathname.startsWith("/orders");

  const hideHeader = location.pathname.startsWith("/seller");
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900">
      {!hideHeader && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
          <Route path="/seller/products" element={<SellerProductsPage />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
      <Cart onCheckoutComplete={handleCheckoutComplete} />
      <OrderConfirmation
        open={confirmationOpen}
        onClose={handleCloseConfirmation}
        customerName={userName}
        customerEmail={userEmail}
        orderId={pendingOrderId ?? undefined}
        onVerified={(orderId) => {
          markOrderConfirmed(orderId);
          clearCart();
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}
