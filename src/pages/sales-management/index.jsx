import React, { useContext } from "react";
import CommonPageIndex from "../../components/CommonPageIndex";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ArrowCircleRight } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { navigationData } from "../../navigation/navigationData";
import { AppContext } from "../../context/AppContext";

function SalesManagement() {
  // return (
  //   <CommonPageIndex pathname="/user-management" title="User Management" />
  // );
  const location = useLocation();
  const navigate = useNavigate();

  const { notifications } = useContext(AppContext);

  const permissions = useSelector((state) => state.permissions?.permissions);
  const permittedNavigators = navigationData
    .find(
      (item) =>
        item.name === "Sales Management" && item.sub && Array.isArray(item.sub)
    )
    .sub?.filter((sub) => permissions?.includes(sub.name))
    ?.map((sub) => sub);

  if (location.pathname === "/sales-management") {
    return (
      <Box className="pageIndex">
        <Box className="pageIndex__banner">
          <Typography className="pageIndex__banner__title">
            Sales Management
          </Typography>
        </Box>

        <Box className="pageIndex__navigators">
          {permittedNavigators.map((navigator) => (
            <Box
              className="pageIndex__navigators__item"
              onClick={() => navigate(navigator.path)}
            >
              <Box className="pageIndex__navigators__item__text">
                <Typography className="pageIndex__navigators__item__text__title">
                  {navigator.name}
                </Typography>
                <Typography className="pageIndex__navigators__item__text__subTitle">
                  {navigator.description}
                </Typography>
              </Box>

              <Box className="pageIndex__navigators__item__notifAndArrow">
                <Box>
                  {!!notifications[navigator.notifications] &&
                  !notifications[navigator.notifications] !== 0 &&
                  !isNotificationFetching ? (
                    <Box className="notificationsLarge">
                      {notifications[navigator.notifications]}
                    </Box>
                  ) : (
                    <Box></Box>
                  )}
                </Box>
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

export default SalesManagement;
