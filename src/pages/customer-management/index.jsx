import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import CommonPageIndex from "../../components/CommonPageIndex";

function CustomerManagement() {
  return (
    <CommonPageIndex
      pathname="/customer-management"
      title="Customer Management"
    />
  );
  // const location = useLocation()

  // if (location.pathname === "/discount") {
  //   return (
  //     <div>Customer Management</div>
  //   )
  // }

  // return <Outlet />
}

export default CustomerManagement;
