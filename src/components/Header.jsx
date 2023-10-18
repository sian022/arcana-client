import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import React from "react";
import "../assets/styles/navbar.styles.scss";
import LogoutButton from "./LogoutButton";
import { formatDate } from "../utils/CustomFunctions";
import { navigationData } from "../navigation/navigationData";
import { useNavigate } from "react-router-dom";
import { setSelectedStoreType } from "../features/prospect/reducers/selectedStoreTypeSlice";
import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedStoreType = useSelector(
    (state) => state.selectedStoreType.value
  );

  const today = new Date();
  const currentDate = formatDate(
    today.getMonth(),
    today.getDate(),
    today.getFullYear(),
    today.getHours(),
    today.getMinutes()
  );

  // const navigationLabel = navigationData.flatMap((item) => {
  //   if (item.sub) {
  //     return item.sub.map((sub) => sub.name);
  //   }
  //   return [];
  // });

  const navigationLabel = navigationData.reduce((accumulator, item) => {
    if (item.sub) {
      accumulator.push(...item.sub);
    }
    return accumulator;
  }, []);

  const handleNavigate = (_, sub) => {
    navigate(sub.path);
  };

  return (
    <Box className="navbar">
      <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Typography className="navbar__dateToday">{currentDate}</Typography>
        {selectedStoreType && (
          <IconButton
            onClick={() => {
              dispatch(setSelectedStoreType(""));
            }}
            sx={{
              backgroundColor: "secondary.main",
              color: "white !important",
              "&:hover": {
                backgroundColor: "accent.main",
              },
            }}
          >
            <KeyboardDoubleArrowLeft />
          </IconButton>
        )}
      </Box>

      {/* <Autocomplete
        options={navigationLabel}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Quick Navigate"
            sx={{ width: "300px" }}
            size="small"
          />
        )}
        onChange={handleNavigate}
      /> */}
      <Box className="navbar__endButtons">
        <LogoutButton />
      </Box>
    </Box>
  );
}

export default Header;
