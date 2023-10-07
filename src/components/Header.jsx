import { Logout } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import "../assets/styles/navbar.styles.scss";
import LogoutButton from "./LogoutButton";
import { formatDate } from "../utils/CustomFunctions";

function Header() {
  const today = new Date();
  const currentDate = formatDate(
    today.getMonth(),
    today.getDate(),
    today.getFullYear(),
    today.getHours(),
    today.getMinutes()
  );

  return (
    <Box className="navbar">
      <Typography className="navbar__dateToday">{currentDate}</Typography>
      <Box className="navbar__endButtons">
        <LogoutButton />
      </Box>
    </Box>
  );
}

export default Header;
