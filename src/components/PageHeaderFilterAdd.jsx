import {
  Box,
  Checkbox,
  Menu,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import "../assets/styles/common.styles.scss";
import SecondaryButton from "./SecondaryButton";
import { debounce } from "../utils/CustomFunctions";

function PageHeaderFilterAdd({
  onOpen,
  pageTitle,
  setStatus,
  setSearch,
  removeAdd,
  removeArchive,
  filterChoices,
  choiceLabel,
  choiceValue,
  setFilter,
}) {
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  return (
    <Box sx={{ padding: "1px" }}>
      <Box component={Paper} className="pageHeader">
        <Box className="pageHeader__left">
          <Typography className="pageHeader__title">{pageTitle}</Typography>
          {!removeAdd && (
            <SecondaryButton className="addRowButtons" onClick={onOpen}>
              Add
            </SecondaryButton>
          )}
        </Box>
        <Box className="pageHeader__right">
          <Select
            size="small"
            // select
            // label="Role"
            onChange={(e) =>
              setFilter && e.target.value === " "
                ? setFilter("")
                : setFilter(e.target.value)
            }
            defaultValue={" "}
          >
            <MenuItem value=" ">All</MenuItem>
            {filterChoices?.map((choice) => (
              <MenuItem key={choice.id} value={choice[choiceValue]}>
                {choice[choiceLabel]}
              </MenuItem>
            ))}
          </Select>
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
            label="Search"
            onChange={(e) => {
              debouncedSetSearch(e.target.value);
            }}
            autoComplete="off"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default PageHeaderFilterAdd;
