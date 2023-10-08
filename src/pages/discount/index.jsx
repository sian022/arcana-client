import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import CommonPageIndex from "../../components/CommonPageIndex";

function Discount() {
  return <CommonPageIndex pathname="/discount" title="Discount" />;
  // const location = useLocation()

  // if (location.pathname === "/discount") {
  //   return (
  //     <div>Discount</div>
  //   )
  // }

  // return <Outlet />
}

export default Discount;
