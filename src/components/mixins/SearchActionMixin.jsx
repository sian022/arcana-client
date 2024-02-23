import { Box, TextField, debounce } from "@mui/material";
import SecondaryButton from "../SecondaryButton";

function SearchActionMixin({ setSearch, actionTitle, actionCallback }) {
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
        <SecondaryButton size="medium" onClick={actionCallback}>
          {actionTitle || "Action"}
        </SecondaryButton>
      </Box>
    </Box>
    // </Paper>
  );
}

export default SearchActionMixin;
