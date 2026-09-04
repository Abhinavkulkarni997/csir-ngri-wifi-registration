import {  useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({
  children,
}: ProtectedRouteProps) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/me`,
          {
            credentials: "include",
          },
        );

        if (response.status === 401) {
          setAuthenticated(false);
          return;
        }

        if (!response.ok) {
          setAuthenticated(false);
          return;
        }

        const result = await response.json();

        setAuthenticated(
          result.success === true,
        );
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error,
        );

        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuthentication();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700" />

          <p className="text-sm text-slate-600">
            Verifying administrator access...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/wifi-admin/login"
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;