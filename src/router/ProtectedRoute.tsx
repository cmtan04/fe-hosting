import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserEndpoint } from "../api/endpoints/user.endpoint";
import { getUserPRofile } from "../api/configs/user.config";
import { useLoading } from "../providers/loadingProvider";
import { ROUTER_PATH } from "./Route";

const ProtectedRoute: React.FC = () => {
  const { setLoading } = useLoading();

  const { data: user, isLoading } = useQuery({
    queryKey: [UserEndpoint.GET_USER_INFORMATION],
    queryFn: () => getUserPRofile(),
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  if (!isLoading && !user) {
    return <Navigate to={ROUTER_PATH.SIGN_IN} replace />;
  }
  localStorage.setItem("userRole", user?.role as string);
  return <Outlet />;
};

export default ProtectedRoute;
