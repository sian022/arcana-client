import { Box, Checkbox, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import "../assets/styles/common.styles.scss";
import SecondaryButton from "./SecondaryButton";
import CommonDrawer from "./CommonDrawer";

function PageHeaderAdd({ onOpen, pageTitle }) {
  return (
    <Paper elevation={1}>
      <Box className="pageHeader">
        <Box className="pageHeader__left">
          <Typography className="pageHeader__title">{pageTitle}</Typography>
          <SecondaryButton className="addRowButtons" onClick={onOpen}>
            Add
          </SecondaryButton>
        </Box>
        <Box className="pageHeader__right">
          <Checkbox />
          <Typography variant="subtitle2">Archived</Typography>
          <TextField type="search" size="small" label="Search" />
        </Box>
      </Box>
    </Paper>
  );
}

export default PageHeaderAdd;
