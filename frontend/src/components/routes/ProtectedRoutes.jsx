import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAdmin }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) {
    return null;
  }

  if (!isAuthenticated || (isAdmin && user.role !== "admin")) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;