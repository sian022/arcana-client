import React from "react";
import CommonPageIndex from "../../components/CommonPageIndex";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ArrowCircleRight } from "@mui/icons-material";

function UserManagement() {
  // return (
  //   <CommonPageIndex pathname="/user-management" title="User Management" />
  // );
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/user-management") {
    return (
      <Box className="pageIndex">
        <Box className="pageIndex__banner">
          <Typography className="pageIndex__banner__title">
            User Management
          </Typography>
        </Box>

        <Box className="pageIndex__navigators">
          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("user-account")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                User Account
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create user accounts based on SEDAR
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("user-role")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                User Role
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and tag user roles
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("approver")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Approver
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage list and ordering of approvers
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("company")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Company
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and sync company to FISTO
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("department")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Department
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and sync department to FISTO
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("location")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Location
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and sync location to FISTO
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
  return <Outlet />;
}

export default UserManagement;
