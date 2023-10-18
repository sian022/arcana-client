import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import CommonPageIndex from "../../components/CommonPageIndex";

function Terms() {
  return <CommonPageIndex pathname="/terms" title="Terms" />;
  // const location = useLocation()

  // if (location.pathname === "/terms") {
  //   return (
  //     <div>Terms</div>
  //   )
  // }

  // return <Outlet />
}

export default Terms;
