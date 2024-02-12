import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navigationData } from "../navigation/navigationData";
import {
  Backdrop,
  Box,
  Collapse,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import "../assets/styles/sidebar.styles.scss";
import { NavLink, useLocation } from "react-router-dom";
import { getIconElement } from "./GetIconElement";
import SystemLogoName from "../assets/images/SystemLogoName.png";
import SystemLogo from "../assets/images/SystemLogo.png";
import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import {
  toggleSidebar,
  toggleSidebarSmallScreen,
} from "../features/misc/reducers/disclosureSlice";
import { AppContext } from "../context/AppContext";
import { usePatchReadNotificationMutation } from "../features/notification/api/notificationApi";

function Sidebar() {
  const [activeModule, setActiveModule] = useState("");
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1024);

  const dispatch = useDispatch();
  const location = useLocation();

  const permissions = useSelector((state) => state.permissions?.permissions);
  const permittedSidebar = navigationData.filter((item) =>
    permissions?.includes(item.name)
  );
  const sidebarToggled = useSelector((state) => state.disclosure.sidebar);
  const sidebarSmallScreenToggled = useSelector(
    (state) => state.disclosure.sidebarSmallScreen
  );

  const { notifications, isNotificationFetching } = useContext(AppContext);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Emp

  useEffect(() => {
    const regex = /\/.*\//;

    if (regex.test(location.pathname)) {
      setActiveModule(location.pathname);
    }
  }, [location.pathname]);

  return (
    <>
      <Box
        className="sidebarWrapper"
        sx={{
          width: (isWideScreen ? sidebarToggled : sidebarSmallScreenToggled)
            ? "300px"
            : 0,

          // whiteSpace: !sidebarToggled && "nowrap",
        }}
      >
        <Box className="sidebar">
          <Box className="sidebar__logo">
            <img
              // src={isWideScreen ? SystemLogoName : SystemLogo}
              src={SystemLogoName}
              alt="arcana-logo"
            />
            <IconButton
              className="sidebar__toggleRemove"
              onClick={() => {
                dispatch(toggleSidebarSmallScreen());
              }}
            >
              <KeyboardDoubleArrowLeft />
            </IconButton>
          </Box>
          <Box className="sidebar__navigation">
            {permittedSidebar.map(
              // {navigationData.map(
              (item) => (
                <React.Fragment key={item.id}>
                  <NavLink to={item.path}>
                    {({ isActive }) => (
                      <ListItem disablePadding sx={{ px: 2 }}>
                        <ListItemButton
                          className={`sidebar__navigation__button  ${
                            isActive ? "active" : ""
                          }`}
                          onClick={() => {
                            // sessionStorage.setItem("activeModule", item.name);
                            setActiveModule(
                              // activeModule === item.path ? "" : item.path
                              activeModule?.includes(item.path) ? "" : item.path
                            );
                          }}
                        >
                          <ListItemIcon
                            className={`sidebar__navigation__button__icon  ${
                              isActive ? "active" : ""
                            }`}
                          >
                            {getIconElement(item.icon)}
                          </ListItemIcon>

                          <ListItemText>{item.name}</ListItemText>

                          {item?.notifications?.reduce(
                            (sum, notification) =>
                              sum + parseInt(notifications[notification]),
                            0
                          ) > 0 &&
                            !isNotificationFetching && (
                              <Box sx={{ width: "20px", height: "20px" }}>
                                {item.notifications && (
                                  <Box className="notifications">
                                    {item?.notifications?.reduce(
                                      (sum, notification) =>
                                        sum +
                                        parseInt(notifications[notification]),
                                      0
                                    )}
                                  </Box>
                                )}
                              </Box>
                            )}

                          {/* {sidebarToggled && (
                        <ListItemText>{item.name}</ListItemText>
                      )} */}
                        </ListItemButton>
                      </ListItem>
                    )}
                  </NavLink>

                  {item.sub && (
                    <Collapse
                      // in={activeModule === item.path}
                      in={activeModule?.includes(item.path)}
                      timeout="auto"
                      unmountOnExit
                    >
                      {item.sub
                        ?.filter((sub) => permissions?.includes(sub.name))
                        .map((subItem) => (
                          <NavLink to={subItem.path} key={subItem.id}>
                            {({ isActive }) => (
                              <ListItem disablePadding sx={{ px: 2 }}>
                                <ListItemButton
                                  className={`sidebar__navigation__subButton  ${
                                    isActive ? "active" : ""
                                  }`}
                                >
                                  <ListItemIcon
                                    className={`sidebar__navigation__subButton__icon  ${
                                      isActive ? "active" : ""
                                    }`}
                                  >
                                    {getIconElement(subItem.icon)}
                                  </ListItemIcon>

                                  {/* {sidebarToggled && (
                              <ListItemText>{subItem.name}</ListItemText>
                            )} */}
                                  <ListItemText>{subItem.name}</ListItemText>
                                  {/* {subItem.notification && (
                                  <Box
                                    sx={{
                                      bgcolor: "notification.main",
                                      borderRadius: "50%",
                                      width: "10%",
                                      // height: "20px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      color: "white !important",
                                    }}
                                  >
                                    {notifications[subItem.notification] > 0 &&
                                      notifications[subItem.notification]}
                                  </Box>
                                )} */}
                                  {subItem?.notifications?.reduce(
                                    (sum, notification) =>
                                      sum +
                                      parseInt(notifications[notification]),
                                    0
                                  ) > 0 && (
                                    <Box sx={{ width: "20px", height: "20px" }}>
                                      {subItem?.notifications &&
                                        !isNotificationFetching && (
                                          <Box
                                            sx={{
                                              bgcolor: "notification.main",
                                              borderRadius: "50%",
                                              // width: "12%",
                                              width: "20px",
                                              height: "20px",
                                              // height: "20px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              color: "white !important",
                                            }}
                                          >
                                            {subItem?.notifications?.reduce(
                                              (sum, notification) =>
                                                sum +
                                                parseInt(
                                                  notifications[notification]
                                                ),
                                              0
                                            )}
                                          </Box>
                                        )}
                                    </Box>
                                  )}
                                </ListItemButton>
                              </ListItem>
                            )}
                          </NavLink>
                        ))}
                    </Collapse>
                  )}
                </React.Fragment>
              )
            )}
          </Box>
        </Box>
      </Box>
      {/* <Box
        className="overlaySidebar"
        // sx={{ display: sidebarSmallScreenToggled && "block" }}
      ></Box> */}
    </>
  );
}

export default Sidebar;
