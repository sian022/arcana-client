import React from "react";
import CommonPageIndex from "../../components/CommonPageIndex";

function UserManagement() {
  return (
    <CommonPageIndex pathname="/user-management" title="User Management" />
  );
  // const location = useLocation();

  // if (location.pathname === "/user-management") {
  //   return (
  //     <Box className="pageIndex">
  //       <Box className="pageIndex__banner">
  //         <Typography className="pageIndex__banner__title">
  //           User Management
  //         </Typography>
  //       </Box>
  //     </Box>
  //   );
  // }
  // return <Outlet />;
}

export default UserManagement;
