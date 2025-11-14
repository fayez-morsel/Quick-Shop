
import { useStore } from "../store/useStore";



export default function ProductDetailsPage() {
  
  
  const product = useStore((s) => s.products.find((p) => p.id === id));
  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eaf4ff] text-slate-900">
        <p className="text-xl font-semibold">Product not found.</p>
      </div>
    );
  }

 
}
