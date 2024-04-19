import { Box, Checkbox, TextField, Typography, debounce } from "@mui/material";

function ArchiveSearchMixin({ setStatus, setSearch }) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    // <Paper elevation={1}>
    <Box className="mixin">
      <Box className="mixin__left">
        {/* <SecondaryButton className="addRowButtons" onClick={onAddOpen}>
            Add {addTitle && addTitle}
          </SecondaryButton> */}
      </Box>
      <Box className="mixin__right">
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
    // </Paper>
  );
}

export default ArchiveSearchMixin;
