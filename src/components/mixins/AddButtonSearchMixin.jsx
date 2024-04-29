import { Box, TextField, debounce } from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import { Add } from "@mui/icons-material";

function AddButtonSearchMixin({
  endIcon,
  title,
  addTitle,
  buttonTitle,
  buttonIcon,
  onButtonClick,
  onAddOpen,
  setSearch,
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
          endIcon={endIcon ? endIcon : <Add />}
        >
          {title ? title : `Add ${addTitle && addTitle}`}
        </SecondaryButton>
      </Box>

      <Box className="mixin__right" sx={{ alignItems: "center" }}>
        <SecondaryButton
          variant="outlined"
          size="medium"
          onClick={onButtonClick}
          endIcon={buttonIcon && buttonIcon}
        >
          {buttonTitle ? buttonTitle : "Button"}
        </SecondaryButton>

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

export default AddButtonSearchMixin;
