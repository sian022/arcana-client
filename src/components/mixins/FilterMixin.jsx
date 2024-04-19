import { Box, MenuItem, TextField } from "@mui/material";

function FilterMixin({ selectOptions, setSelectValue }) {
  return (
    // <Paper elevation={1}>
    <Box className="mixin" sx={{ my: "-20px" }}>
      <Box className="mixin__left"></Box>
      <Box className="mixin__right">
        <TextField
          sx={{ minWidth: "150px" }}
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

export default FilterMixin;
