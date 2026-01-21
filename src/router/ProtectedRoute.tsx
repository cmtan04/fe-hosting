import React from "react";
import { Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  // const { isAuthenticated, isLoading } = useAuth();

  // if (!isLoading && !isAuthenticated) {
  //     return <Navigate to={ROUTER_PATH.SIGN_IN} replace />;
  // }
  return <Outlet />;
};

export default ProtectedRoute;
