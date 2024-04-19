import { Box, Checkbox, TextField, Typography, debounce } from "@mui/material";

function SearchVoidMixin({ setSearch, setStatus, status }) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    // <Paper elevation={1}>
    <Box className="mixin" sx={{ mt: "-20px" }}>
      <Box className="mixin__left"></Box>

      <Box className="mixin__right">
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
