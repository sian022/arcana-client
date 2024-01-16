import { Box, MenuItem, TextField, debounce } from "@mui/material";
import React from "react";

function SearchFilterMixin({ setSearch, selectOptions, setSelectValue }) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    // <Paper elevation={1}>
    <Box className="pageHeader" sx={{ my: "-20px" }}>
      <Box className="pageHeader__left">
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
      <Box className="pageHeader__right">
        <TextField
          sx={{ width: "150px" }}
          size="small"
          label="Origin"
          defaultValue={selectOptions?.[0]?.value}
          select
          onChange={(e) => setSelectValue(e.target.value)}
        >
          {selectOptions.map((item, i) => (
            <MenuItem key={i} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
    // </Paper>
  );
}

export default SearchFilterMixin;
