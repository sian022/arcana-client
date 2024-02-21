import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PermittedRoutes from "./PermittedRoutes";

function ProtectedRoutes() {
  const fullname = useSelector((state) => state.login.fullname);
  const permissions = useSelector((state) => state.permissions.permissions);

  if (!fullname || permissions?.length === 0) {
    return <Navigate to="/login" />;
  }

  // return <MainLayout />;
  return <PermittedRoutes />;
}

export default ProtectedRoutes;
