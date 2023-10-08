import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import CommonPageIndex from "../../components/CommonPageIndex";

function Approval() {
  return <CommonPageIndex pathname="/approval" title="Approval" />;
  // const location = useLocation()

  // if (location.pathname === "/approval") {
  //   return (
  //     <div>Approval</div>
  //   )
  // }

  // return <Outlet />
}

export default Approval;
