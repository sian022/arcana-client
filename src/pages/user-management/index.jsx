import React from "react";
import CommonPageIndex from "../../components/CommonPageIndex";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ArrowCircleRight } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { navigationData } from "../../navigation/navigationData";
import { getIconElement } from "../../components/GetIconElement";

function UserManagement() {
  // return (
  //   <CommonPageIndex pathname="/user-management" title="User Management" />
  // );
  const location = useLocation();
  const navigate = useNavigate();

  const permissions = useSelector((state) => state.permissions?.permissions);
  const permittedNavigators = navigationData
    .find(
      (item) =>
        item.name === "User Management" && item.sub && Array.isArray(item.sub)
    )
    .sub?.filter((sub) => permissions?.includes(sub.name))
    ?.map((sub) => sub);

  if (location.pathname === "/user-management") {
    return (
      <Box className="pageIndex">
        <Box className="pageIndex__banner">
          <Typography className="pageIndex__banner__title">
            User Management
          </Typography>
        </Box>

        <Box className="pageIndex__navigators">
          {permittedNavigators.map((navigator) => (
            <Box
              className="pageIndex__navigators__item"
              onClick={() => navigate(navigator.path)}
            >
              <Box className="pageIndex__navigators__item__text">
                <Box className="pageIndex__navigators__item__text__titleAndIcon">
                  <Typography className="pageIndex__navigators__item__text__titleAndIcon__title">
                    {navigator.name}
                  </Typography>

                  <Box className="pageIndex__navigators__item__text__titleAndIcon__icon">
                    {getIconElement(navigator.icon, "white")}
                  </Box>
                </Box>
                <Typography className="pageIndex__navigators__item__text__subTitle">
                  {navigator.description}
                </Typography>
              </Box>

              <Box className="pageIndex__navigators__item__notifAndArrow">
                <Box></Box>
                <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
  return <Outlet />;
}

export default UserManagement;
