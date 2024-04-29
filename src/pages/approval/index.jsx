import { useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowCircleRight } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { AppContext } from "../../context/AppContext";
import { useSelector } from "react-redux";
import { navigationData } from "../../navigation/navigationData";
import { getIconElement } from "../../components/GetIconElement";

function Approval() {
  const location = useLocation();
  const navigate = useNavigate();

  const { notifications, isNotificationFetching } = useContext(AppContext);

  const permissions = useSelector((state) => state.permissions?.permissions);
  const permittedNavigators = navigationData
    .find(
      (item) => item.name === "Approval" && item.sub && Array.isArray(item.sub)
    )
    .sub?.filter((sub) => permissions?.includes(sub.name))
    ?.map((sub) => sub);

  if (location.pathname === "/approval") {
    return (
      <Box className="pageIndex">
        <Box className="pageIndex__banner">
          <Typography className="pageIndex__banner__title">Approval</Typography>
        </Box>

        <Box className="pageIndex__navigators">

          {permittedNavigators.map((navigator) => (
            <Box
              key={navigator.name}
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

export default Approval;
