import {
  Box,
  Checkbox,
  Paper,
  TextField,
  Typography,
  debounce,
} from "@mui/material";
import React from "react";

function SearchVoidMixin({ setSearch, setStatus, status }) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    // <Paper elevation={1}>
    <Box className="pageHeader" sx={{ mt: "-20px" }}>
      <Box className="pageHeader__left"></Box>

      <Box className="pageHeader__right">
        <Checkbox
          onChange={() => {
            status === "Voided" ? setStatus("") : setStatus("Voided");
          }}
        />
        <Typography variant="subtitle2">Voided</Typography>

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

export default SearchVoidMixin;
