import { Box, Checkbox, Paper, TextField, Typography } from "@mui/material";
import "../assets/styles/common.styles.scss";
import SecondaryButton from "./SecondaryButton";
import { debounce } from "../utils/CustomFunctions";
import TertiaryButton from "./TertiaryButton";
import { Add, FileDownload } from "@mui/icons-material";

function PageHeaderAddButtonSearch({
  onOpen,
  pageTitle,
  setStatus,
  setSearch,
  removeAdd,
  removeArchive,
  searchPlaceholder,
  secondButtonTitle,
  secondButtonOnClick,
}) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    <Box sx={{ padding: "1px" }}>
      <Box component={Paper} className="pageHeader" elevation={1}>
        <Box className="pageHeader__left">
          <Typography className="pageHeader__title">{pageTitle}</Typography>
          {!removeAdd && (
            <SecondaryButton
              className="addRowButtons"
              onClick={onOpen}
              endIcon={<Add />}
            >
              Add
            </SecondaryButton>
          )}

          <TertiaryButton
            // variant="outlined"
            // sx={{ color: "tertiary.main !important" }}
            endIcon={<FileDownload />}
            onClick={secondButtonOnClick}
          >
            {secondButtonTitle || "Button"}
          </TertiaryButton>
        </Box>

        <Box className="pageHeader__right">
          {!removeArchive && (
            <>
              <Checkbox
                onChange={() => {
                  setStatus((prev) => !prev);
                }}
              />
              <Typography variant="subtitle2">Archived</Typography>{" "}
            </>
          )}

          <TextField
            type="search"
            size="small"
            label={searchPlaceholder ? searchPlaceholder : "Search"}
            onChange={(e) => {
              debouncedSetSearch(e.target.value);
            }}
            sx={{ minWidth: "200px" }}
            autoComplete="off"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default PageHeaderAddButtonSearch;
