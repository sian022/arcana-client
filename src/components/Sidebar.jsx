import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { navigationData } from "../navigation/navigationData";
import {
  Box,
  Collapse,
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

function Sidebar() {
  const [activeModule, setActiveModule] = useState("");
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1024);

  const permissions = useSelector((state) => state.permissions?.permissions);
  const permittedSidebar = navigationData.filter((item) =>
    permissions?.includes(item.name)
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
    <Box className="sidebar">
      <Box className="sidebar__logo">
        <img
          src={isWideScreen ? SystemLogoName : SystemLogo}
          alt="arcana-logo"
        />
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
  );
}

export default Sidebar;
