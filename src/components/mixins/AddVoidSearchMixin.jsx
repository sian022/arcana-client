import { Box, Checkbox, TextField, Typography, debounce } from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import { Add } from "@mui/icons-material";

function AddVoidSearchMixin({
  addTitle,
  onAddOpen,
  setSearch,
  setStatus,
  status,
}) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    // <Paper elevation={1}>
    <Box className="mixin" sx={{ mt: "-20px" }}>
      <Box className="mixin__left">
        <SecondaryButton
          className="addRowButtons"
          onClick={onAddOpen}
          endIcon={<Add />}
        >
          Add {addTitle && addTitle}
        </SecondaryButton>
      </Box>

      <Box className="mixin__right">
        {(status === "Voided" || status === "Rejected") && (
          <>
            <Checkbox
              onChange={() => {
                status === "Voided"
                  ? setStatus("Rejected")
                  : setStatus("Voided");
              }}
              checked={status === "Voided"}
            />
            <Typography variant="subtitle2">Voided</Typography>
          </>
        )}

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

export default AddVoidSearchMixin;
