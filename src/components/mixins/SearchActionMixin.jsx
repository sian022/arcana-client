import { Box, TextField, debounce } from "@mui/material";
import SecondaryButton from "../SecondaryButton";

function SearchActionMixin({
  setSearch,
  actionTitle,
  actionCallback,
  removeAction,
  disableAction,
}) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    // <Paper elevation={1}>
    <Box className="mixin" sx={{ my: "-20px" }}>
      <Box className="mixin__left">
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

      <Box className="mixin__right">
        {!removeAction && (
          <SecondaryButton
            size="medium"
            disabled={disableAction}
            onClick={actionCallback}
          >
            {actionTitle || "Action"}
          </SecondaryButton>
        )}
      </Box>
    </Box>
    // </Paper>
  );
}

export default SearchActionMixin;
