import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PermittedRoutes from "./PermittedRoutes";

function ProtectedRoutes() {
  const fullname = useSelector((state) => state.login.fullname);
  const permissions = useSelector((state) => state.permissions.permissions);

  // if (!fullname || permissions?.length === 0) {
  //   return <Navigate to="/login" />;
  // }

  return <MainLayout />;
  // return <PermittedRoutes />;
}

export default ProtectedRoutes;
