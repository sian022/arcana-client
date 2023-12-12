import {
  Box,
  Checkbox,
  Paper,
  TextField,
  Typography,
  debounce,
} from "@mui/material";
import React from "react";
import SecondaryButton from "../SecondaryButton";

function AddSearchMixin({ addTitle, onAddOpen, setSearch }) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    // <Paper elevation={1}>
    <Box className="pageHeader">
      <Box className="pageHeader__left">
        <SecondaryButton className="addRowButtons" onClick={onAddOpen}>
          Add {addTitle && addTitle}
        </SecondaryButton>
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
    // </Paper>
  );
}

export default AddSearchMixin;
