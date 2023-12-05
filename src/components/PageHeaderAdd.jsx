import { Box, Checkbox, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import "../assets/styles/common.styles.scss";
import SecondaryButton from "./SecondaryButton";
import { debounce } from "../utils/CustomFunctions";

function PageHeaderAdd({ onOpen, pageTitle, setStatus, setSearch, removeAdd }) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    <Box sx={{ padding: "1px" }}>
      <Box component={Paper} className="pageHeader">
        <Box className="pageHeader__left">
          <Typography className="pageHeader__title">{pageTitle}</Typography>
          {!removeAdd && (
            <SecondaryButton className="addRowButtons" onClick={onOpen}>
              Add
            </SecondaryButton>
          )}
        </Box>
        <Box className="pageHeader__right">
          <Checkbox
            onChange={() => {
              setStatus((prev) => !prev);
            }}
          />
          <Typography variant="subtitle2">Archived</Typography>
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

export default PageHeaderAdd;
