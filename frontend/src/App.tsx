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
import {
  useAuthStore,
  useCartStore,
  useFavoriteStore,
  useOrderStore,
  useProductStore,
} from "./store";

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
  const [placingOrder, setPlacingOrder] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [orderPlacementError, setOrderPlacementError] = useState<string | null>(null);
  const userName = useAuthStore((s) => s.userName);
  const userEmail = useAuthStore((s) => s.userEmail);
  const autoDeliverAfterConfirm = useOrderStore((s) => s.autoDeliverAfterConfirm);
  const clearCart = useCartStore((s) => s.clearCart);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const loadCart = useCartStore((s) => s.loadCart);
  const loadFavorites = useFavoriteStore((s) => s.loadFavorites);
  const fetchBuyerOrders = useOrderStore((s) => s.fetchBuyerOrders);

  useEffect(() => {
    initializeAuth();
    fetchProducts();
    loadCart();
    loadFavorites();
    fetchBuyerOrders();
  }, [fetchBuyerOrders, fetchProducts, initializeAuth, loadCart, loadFavorites]);

  const handleCheckoutStart = () => {
    setOrderPlacementError(null);
    setPlacingOrder(true);
    setPendingOrderId(null);
    setConfirmationOpen(true);
  };
  const handleCheckoutComplete = (orderId?: string) => {
    setPlacingOrder(false);
    if (!orderId) {
      setOrderPlacementError("We couldn't create your order. Please try again.");
      return;
    }
    setPendingOrderId(orderId);
    setConfirmationOpen(true);
  };
  const handleCheckoutError = (message?: string) => {
    setPlacingOrder(false);
    setPendingOrderId(null);
    setOrderPlacementError(message ?? "We couldn't create your order. Please try again.");
    setConfirmationOpen(true);
  };
  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    setPendingOrderId(null);
    setOrderPlacementError(null);
    setPlacingOrder(false);
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
      <Cart
        onCheckoutStart={handleCheckoutStart}
        onCheckoutComplete={handleCheckoutComplete}
        onCheckoutError={handleCheckoutError}
      />
      <OrderConfirmation
        open={confirmationOpen}
        onClose={handleCloseConfirmation}
        isPlacingOrder={placingOrder}
        placementError={orderPlacementError ?? undefined}
        customerName={userName}
        customerEmail={userEmail}
        orderId={pendingOrderId ?? undefined}
        onVerified={(orderId) => {
          autoDeliverAfterConfirm(orderId);
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
