import { useNavigate } from "react-router-dom";


export default function LoginPage() {
    const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4"
      style={{
        background: "linear-gardient(180deg, var(--bg-main), var(--bg-card))",
        color: "var(--text-main)",
      }}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm rounded-xl shadow-md p-8 space-y-6 transition-all duration-300"
        style={{
          backgroundColor: "var(--bg-card)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-12 w-12 rounded-full grid place-items-center"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            👤
          </div>
          <h2 className="text-xl font-semibold">Welcome back</h2>
          <p className="text-sm text-(--text-secondary)">
            Sign in to your account to continue
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="John@example.com"
              className="w-full px-3 py-2 rounded-md border border-(--border-color)
                         bg-(--bg-input) text-(--text-main)
                         focus:ring-2 focus:ring-(--color-primary) focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full px-3 py-2 rounded-md border border-(--border-color)
                         bg-(--bg-input) text-(--text-main)
                         focus:ring-2 focus:ring-(--color-primary) focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-2 rounded-md text-white font-medium
                       bg-linear-to-r from-(--color-primary) to-(--color-primary-dark)
                       hover:opacity-90 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-(--text-secondary)">
          Don't have an account?{" "}
          <a href="/register" className="text-(--color-primary) font-medium hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
