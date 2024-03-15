import { Box, TextField, debounce } from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import { Add } from "@mui/icons-material";

function AddSearchMixin({ addTitle, onAddOpen, setSearch }) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    // <Paper elevation={1}>
    <Box className="pageHeader" sx={{ mt: "-20px" }}>
      <Box className="pageHeader__left">
        <SecondaryButton
          className="addRowButtons"
          onClick={onAddOpen}
          endIcon={<Add />}
        >
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
