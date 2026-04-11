import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../common/contexts/authContext";
import { useLoading } from "../providers/loadingProvider";
import { ROUTER_PATH } from "./Route";

const ProtectedRoute: React.FC = () => {
  const { setLoading } = useLoading();
  const { isAuthenticated, user, checkAuthStatus, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !user) {
      void checkAuthStatus();
    }
  }, [isAuthenticated, user, checkAuthStatus]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTER_PATH.SIGN_IN} replace />;
  }

  if (!user) {
    return <Navigate to={ROUTER_PATH.SIGN_IN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
