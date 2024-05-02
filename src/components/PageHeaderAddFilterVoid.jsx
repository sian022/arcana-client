import {
  Box,
  Checkbox,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import "../assets/styles/common.styles.scss";
import SecondaryButton from "./SecondaryButton";
import { debounce } from "../utils/CustomFunctions";
import { Add } from "@mui/icons-material";

function PageHeaderAddFilterVoid({
  onOpen,
  pageTitle,
  setStatus,
  setSearch,
  removeAdd,
  removeVoid,
  searchPlaceholder,
  selectOptions,
  setSelectValue,
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
        </Box>
        <Box className="pageHeader__right">
          {!removeVoid && (
            <>
              <Checkbox
                onChange={() => {
                  setStatus((prev) => !prev);
                }}
              />
              <Typography variant="subtitle2">Voided</Typography>{" "}
            </>
          )}

          <TextField
            sx={{ minWidth: "150px" }}
            size="small"
            label="Origin"
            defaultValue={selectOptions?.[0]?.value}
            select
            onChange={(e) => setSelectValue(e.target.value)}
          >
            {selectOptions?.map((item, i) => (
              <MenuItem key={i} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>

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

export default PageHeaderAddFilterVoid;
