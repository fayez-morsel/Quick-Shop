import { X } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import { useOrderStore } from "../store";

type Props = {
  open: boolean;
  onClose: () => void;
  customerName?: string;
  customerEmail?: string;
  orderId?: string | null;
  onVerified?: (orderId: string) => void;
};

export default function OrderConfirmation({
  open,
  onClose,
  customerName,
  customerEmail,
  orderId,
  onVerified,
}: Props) {
  const confirmOrder = useOrderStore((s) => s.confirmOrder);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setCode("");
      setVerified(false);
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(digits);
    setError("");
  };

  const handleConfirm = () => {
    if (code.length !== 6) {
      setError("Enter the 6-digit code we sent to your laptop or phone.");
      return;
    }
    if (!orderId) {
      setError("We couldn't locate the order to confirm.");
      return;
    }
    setSubmitting(true);
    confirmOrder(orderId, code)
      .then(() => {
        setVerified(true);
        onVerified?.(orderId);
      })
      .catch((err: any) => {
        const apiMsg =
          err?.response?.data?.error ??
          err?.response?.data?.message ??
          "Something went wrong confirming your order.";
        setError(apiMsg);
      })
      .finally(() => setSubmitting(false));
  };

  const handleClose = () => {
    setCode("");
    setVerified(false);
    setError("");
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div onClick={handleClose} className="fixed inset-0 bg-black/40 z-40" />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center space-y-4">
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="absolute right-3 top-3 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
          {!verified ? (
            <>
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 text-blue-600 grid place-items-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Confirm Your Order</h2>
              <p className="text-sm text-gray-600">
                Hi {customerName || "Shopper"}, we just pushed a 6-digit code
                to {customerEmail || "your inbox"}. Enter it below to finalize
                your purchase{orderId ? ` for order ${orderId}` : ""}.
              </p>
              </div>

              <div className="text-left space-y-2">
                <label
                  htmlFor="order-code"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
                >
                  6-digit code
                </label>
                <input
                  id="order-code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="000000"
                  value={code}
                  onChange={handleCodeChange}
                  className="w-full rounded-md border border-gray-200 px-4 py-2 text-center text-lg tracking-[0.6em] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error && (
                  <p className="text-xs text-red-500 font-medium">{error}</p>
                )}
                <p className="text-xs text-gray-500">
                  Haven&apos;t received it yet? Check your notifications or wait
                  a few seconds.
                </p>
              </div>

              <button
                onClick={handleConfirm}
                disabled={code.length !== 6 || !orderId || submitting}
                className="w-full rounded-md bg-blue-600 text-white py-2 text-sm font-semibold tracking-wide hover:bg-blue-700 transition disabled:opacity-50 disabled:hover:bg-blue-600"
              >
                {submitting ? "Confirming..." : "Confirm Order"}
              </button>
            </>
          ) : (
            <>
              <div className="mx-auto h-12 w-12 rounded-full bg-green-50 text-green-600 grid place-items-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Code Verified!</h2>
              <p className="text-sm text-gray-600">
                Thanks for confirming, {customerName || "Shopper"}. Your order
                is locked in and we&apos;ll keep you posted once it ships.
              </p>
              <button
                onClick={handleClose}
                className="w-full rounded-md bg-green-600 text-white py-2 text-sm font-semibold hover:bg-green-700 transition"
              >
                Continue Shopping
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
