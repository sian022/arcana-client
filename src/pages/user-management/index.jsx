import { Box, Typography } from "@mui/material";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

function UserManagement() {
  const location = useLocation();

  if (location.pathname === "/user-management") {
    return (
      <Box
        sx={{
          display: "flex",
          // justifyContent: "center",
          alignItems: "center",
          flex: "1",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            backgroundColor: "secondary.main",
            borderRadius: "200px",
            height: "fit-content",
            padding: "30px",
          }}
        >
          <Typography
            sx={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "white !important",
            }}
          >
            User Management
          </Typography>
        </Box>

        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "200px",
              padding: "30px",
            }}
          >
            <Typography>User Account</Typography>
          </Box>
          <Box>
            <Typography>User Account</Typography>
          </Box>
          <Box>
            <Typography>User Account</Typography>
          </Box>
        </Box>
      </Box>
      // <Box sx={{ position: "relative", display: "flex" }}>
      //   {/* <Box
      //     sx={{
      //       bgcolor: "primary.main",
      //       width: "250px",
      //       height: "250px",
      //       borderRadius: "50%",
      //       display: "flex",
      //       justifyContent: "center",
      //       alignItems: "center",
      //       fontSize: "30px",
      //       textAlign: "center",
      //       color: "white !important",
      //       fontWeight: "bold",
      //     }}
      //   >
      //     User Account
      //   </Box> */}
      // </Box>
    );
  }
  return <Outlet />;
}

export default UserManagement;
