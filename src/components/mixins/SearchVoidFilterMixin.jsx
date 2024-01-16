import {
  Box,
  Checkbox,
  MenuItem,
  TextField,
  Typography,
  debounce,
} from "@mui/material";
import React from "react";

function SearchVoidFilterMixin({
  status,
  setStatus,
  setSearch,
  selectOptions,
  setSelectValue,
}) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
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
        {(status === "Voided" || status === "Rejected") && (
          <>
            <Checkbox
              onChange={() => {
                status === "Voided"
                  ? setStatus("Rejected")
                  : setStatus("Voided");
              }}
            />
            <Typography variant="subtitle2">Voided</Typography>
          </>
        )}

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
  );
}

export default SearchVoidFilterMixin;
