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

function AddArchiveSearchMixin({ addTitle, onAddOpen, setStatus, setSearch }) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    <Paper elevation={1}>
      <Box className="pageHeader">
        <Box className="pageHeader__left">
          <SecondaryButton className="addRowButtons" onClick={onAddOpen}>
            Add {addTitle && addTitle}
          </SecondaryButton>
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
    </Paper>
  );
}

export default AddArchiveSearchMixin;
