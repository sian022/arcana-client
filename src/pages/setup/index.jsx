import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import CommonPageIndex from "../../components/CommonPageIndex";

function Setup() {
  return <CommonPageIndex pathname="/setup" title="Setup" />;
  // const location = useLocation()

  // if (location.pathname === "/setup") {
  //   return (
  //     <div>Setup</div>
  //   )
  // }

  // return <Outlet />
}

export default Setup;
