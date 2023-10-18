import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import CommonPageIndex from "../../components/CommonPageIndex";

function CustomerRegistration() {
  return (
    <CommonPageIndex
      pathname="/customer-registration"
      title="Customer Registration"
    />
  );
  // const location = useLocation()

  // if (location.pathname === "/customer-registration") {
  //   return (
  //     <div>CustomerRegistration</div>
  //   )
  // }

  // return <Outlet />
}

export default CustomerRegistration;
