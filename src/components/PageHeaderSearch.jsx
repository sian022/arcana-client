import { Box, Checkbox, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import "../assets/styles/common.styles.scss";
import SecondaryButton from "./SecondaryButton";
import { debounce } from "../utils/CustomFunctions";

function PageHeaderSearch({ onOpen, pageTitle, setStatus, setSearch }) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    <Box sx={{ padding: "1px" }}>
      <Box component={Paper} className="pageHeader">
        <Box className="pageHeader__left">
          <Typography className="pageHeader__title">{pageTitle}</Typography>
        </Box>
        <Box className="pageHeader__right">
          <TextField
            type="search"
            size="small"
            label="Search"
            onChange={(e) => {
              debouncedSetSearch(e.target.value);
            }}
            autoComplete="off"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default PageHeaderSearch;
