import { useSelector } from "react-redux";
import { navigationData } from "./navigationData";
import { useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AccessDenied from "../pages/AccessDenied";

const PermittedRoutes = () => {
  const { pathname } = useLocation();
  const permissions = useSelector((state) => state.permissions.permissions);

  const allowedNavigationData = navigationData.filter((item) => {
    return permissions?.includes(item.name);
  });

  const currentNavItem = allowedNavigationData.find(
    (item) => pathname?.includes(item.path) && item.path !== "/"
  );

  const currentSubNav = currentNavItem?.sub?.filter((subItem) =>
    permissions?.includes(subItem.name)
  );

  const permittedParentPath = allowedNavigationData?.map((item) => {
    return permissions?.includes(item.name) ? item.path : null;
  });

  const permittedSubPath = currentSubNav?.map((item) => {
    return permissions?.includes(item.name) ? item.path : null;
  });

  if (
    permittedParentPath?.includes(pathname) ||
    permittedSubPath?.includes(pathname) ||
    pathname === "/"
  ) {
    return <MainLayout />;
  }

  return <AccessDenied />;
};

export default PermittedRoutes;
