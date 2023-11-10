import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navigationData } from "../navigation/navigationData";
import {
  Box,
  Collapse,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import "../assets/styles/sidebar.styles.scss";
import { NavLink } from "react-router-dom";
import { getIconElement } from "./GetIconElement";
import SystemLogoName from "../assets/images/SystemLogoName.png";
import SystemLogo from "../assets/images/SystemLogo.png";
import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import {
  toggleSidebar,
  toggleSidebarSmallScreen,
} from "../features/misc/reducers/disclosureSlice";

function Sidebar() {
  const [activeModule, setActiveModule] = useState("");
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1024);

  const dispatch = useDispatch();

  const permissions = useSelector((state) => state.permissions?.permissions);
  const permittedSidebar = navigationData.filter((item) =>
    permissions?.includes(item.name)
  );
  const sidebarToggled = useSelector((state) => state.disclosure.sidebar);
  const sidebarSmallScreenToggled = useSelector(
    (state) => state.disclosure.sidebarSmallScreen
  );

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Emp

  return (
    <>
      <Box
        className="sidebar"
        sx={{
          width: (isWideScreen ? sidebarToggled : sidebarSmallScreenToggled)
            ? "300px"
            : 0,
          overflow: "hidden",
          // whiteSpace: !sidebarToggled && "nowrap",
        }}
      >
        <Box className="sidebar__logo">
          <img
            src={isWideScreen ? SystemLogoName : SystemLogo}
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
                        onClick={() =>
                          setActiveModule(
                            activeModule === item.name ? "" : item.name
                          )
                        }
                      >
                        <ListItemIcon
                          className={`sidebar__navigation__button__icon  ${
                            isActive ? "active" : ""
                          }`}
                        >
                          {getIconElement(item.icon)}
                        </ListItemIcon>

                        <ListItemText>{item.name}</ListItemText>
                        {/* {sidebarToggled && (
                        <ListItemText>{item.name}</ListItemText>
                      )} */}
                      </ListItemButton>
                    </ListItem>
                  )}
                </NavLink>

                {item.sub && (
                  <Collapse
                    in={activeModule === item.name}
                    timeout="auto"
                    unmountOnExit
                  >
                    {item.sub.map((subItem) => (
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
    </>
  );
}

export default Sidebar;
