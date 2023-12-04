import { Box, Card, Typography } from "@mui/material";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

function CommonPageIndex({ pathname, title }) {
  const location = useLocation();

  if (location.pathname === pathname) {
    return (
      <Box className="pageIndex">
        <Box className="pageIndex__banner">
          <Typography className="pageIndex__banner__title">{title}</Typography>
        </Box>

        <Box className="pageIndex__navigators">
          <Box className="pageIndex__navigators__item">
            <Typography className="pageIndex__navigators__item__title">
              User Account
            </Typography>
            <Typography className="pageIndex__navigators__item__subTitle">
              Manage user accounts
            </Typography>
          </Box>

          <Box className="pageIndex__navigators__item">
            <Typography className="pageIndex__navigators__item__title">
              User Account
            </Typography>
            <Typography className="pageIndex__navigators__item__subTitle">
              Manage user accounts
            </Typography>
          </Box>

          <Box className="pageIndex__navigators__item">
            <Typography className="pageIndex__navigators__item__title">
              User Account
            </Typography>
            <Typography className="pageIndex__navigators__item__subTitle">
              Manage user accounts
            </Typography>
          </Box>

          <Box className="pageIndex__navigators__item">
            <Typography className="pageIndex__navigators__item__title">
              User Account
            </Typography>
            <Typography className="pageIndex__navigators__item__subTitle">
              Manage user accounts
            </Typography>
          </Box>

          <Box className="pageIndex__navigators__item">
            <Typography className="pageIndex__navigators__item__title">
              User Account
            </Typography>
            <Typography className="pageIndex__navigators__item__subTitle">
              Manage user accounts
            </Typography>
          </Box>

          <Box className="pageIndex__navigators__item">
            <Typography className="pageIndex__navigators__item__title">
              User Account
            </Typography>
            <Typography className="pageIndex__navigators__item__subTitle">
              Manage user accounts
            </Typography>
          </Box>
        </Box>

        {/* <Box sx={{ display: "flex" }}>
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
        </Box> */}
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

export default CommonPageIndex;
