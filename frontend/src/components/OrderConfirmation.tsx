type Props = {
  open: boolean;
  onClose: () => void;
};

export default function OrderConfirmation({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full text-center p-6">
          <div className="text-green-600 text-4xl mb-3">✅</div>
          <h2 className="text-lg font-semibold mb-1">Order Confirmed!</h2>
          <p className="text-sm text-gray-600 mb-5">
            Your order has been successfully placed. We'll notify you once it's
            dispatched for delivery.
          </p>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
}
