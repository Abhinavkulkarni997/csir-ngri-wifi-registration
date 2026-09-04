import {  useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;
import NgriLogo from "../assets/ngrilogo.png";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  const checkAuthentication = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/me`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        return;
      }

      const result = await response.json();

      if (result.success) {
        navigate("/registrations", {
          replace: true,
        });
      }
    } catch (error) {
      console.error(
        "Authentication check failed:",
        error,
      );
    }
  };

  checkAuthentication();
}, [navigate]);

  const handleSubmit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Login failed.",
        );
      }

      navigate("/admin/registrations", {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to login.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <img src={NgriLogo} alt="CSIR-NGRI Logo" className="mx-auto h-16 w-16" />
            <h1 className="text-2xl font-bold text-slate-800">
              CSIR-NGRI
            </h1>

            <p className="mt-2 text-slate-500">
              Wifi Access Administrator Login
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Admin email"
                required
                autoComplete="username"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Admin password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-800 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          CSIR-National Geophysical Research Institute
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;