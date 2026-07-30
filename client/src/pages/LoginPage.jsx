import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import TerminalPanel from "../components/TerminalPanel";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      <TerminalPanel />

      <div className="flex-1 flex items-center justify-center px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
          <p className="text-[var(--color-accent)] text-sm mb-2">// authenticate</p>
          <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-8">
            log_in<span className="text-[var(--color-accent)] cursor-blink">_</span>
          </h1>

          <div className="mb-5">
            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">
              <span className="text-[var(--color-accent)]">$</span> email
            </label>
            <input
              {...register("email")}
              className="w-full bg-[var(--color-panel)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-[var(--color-danger)] text-xs mt-1">// {errors.email.message}</p>
            )}
          </div>

          <div className="mb-7">
            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">
              <span className="text-[var(--color-accent)]">$</span> password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full bg-[var(--color-panel)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-[var(--color-danger)] text-xs mt-1">// {errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--color-accent-warm)] hover:bg-[var(--color-accent-warm-hover)] disabled:opacity-50 rounded py-2.5 text-sm font-medium text-[var(--color-text)] transition"
          >
            {isSubmitting ? "authenticating..." : "run login()"}
          </button>

          <p className="text-sm text-[var(--color-text-muted)] mt-6">
            no account?{" "}
            <Link to="/register" className="text-[var(--color-accent)] hover:underline">
              register()
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;