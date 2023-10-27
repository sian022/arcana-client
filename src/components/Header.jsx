import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useRef } from "react";
import "../assets/styles/navbar.styles.scss";
import LogoutButton from "./LogoutButton";
import { formatDate } from "../utils/CustomFunctions";
import { navigationData } from "../navigation/navigationData";
import { useLocation, useNavigate } from "react-router-dom";
import { setSelectedStoreType } from "../features/prospect/reducers/selectedStoreTypeSlice";
import {
  AccountCircle,
  KeyboardDoubleArrowLeft,
  Lock,
  Logout,
  Password,
  Settings,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import useDisclosure from "../hooks/useDisclosure";
import CommonDialog from "./CommonDialog";
import {
  setFullname,
  setToken,
} from "../features/authentication/reducers/loginSlice";
import { setPermissisons } from "../features/authentication/reducers/permissionsSlice";
import ChangePasswordModal from "./modals/ChangePasswordModal";

function Header() {
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedStoreType = useSelector(
    (state) => state.selectedStoreType.value
  );

  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();

  const {
    isOpen: isLogoutOpen,
    onOpen: onLogoutOpen,
    onClose: onLogoutClose,
  } = useDisclosure();

  const {
    isOpen: isChangePasswordOpen,
    onOpen: onChangePasswordOpen,
    onClose: onChangePasswordClose,
  } = useDisclosure();

  const anchorRef = useRef();

  //Constants
  const routesForStoreType = ["/customer-registration/prospect"];

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

  const handleLogout = () => {
    dispatch(setToken(""));
    dispatch(setFullname(""));
    dispatch(setPermissisons(""));
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("fullname");
    sessionStorage.removeItem("permissions");

    // localStorage.removeItem("token");
    // localStorage.removeItem("fullname");
    // localStorage.removeItem("permissions");
    navigate("/login");
  };

  return (
    <>
      <Box className="navbar">
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Typography className="navbar__dateToday">{currentDate}</Typography>
          {selectedStoreType &&
            routesForStoreType.includes(location.pathname) && (
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
          {/* <LogoutButton /> */}
          <IconButton
            sx={{ color: "secondary.main" }}
            onClick={onMenuOpen}
            ref={anchorRef}
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Box>
      <Menu
        open={isMenuOpen}
        onClose={onMenuClose}
        anchorEl={anchorRef.current}
      >
        <MenuItem className="actionsMenuItem" onClick={onChangePasswordOpen}>
          <Password />
          Change Password
        </MenuItem>
        <MenuItem className="actionsMenuItem" onClick={onLogoutOpen}>
          <Logout />
          Logout
        </MenuItem>
      </Menu>

      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={onChangePasswordClose}
      />

      <CommonDialog
        onClose={onLogoutClose}
        open={isLogoutOpen}
        onYes={handleLogout}
      >
        Are you sure you want to{" "}
        <span style={{ fontWeight: "bold" }}>LOGOUT</span>?
      </CommonDialog>
    </>
  );
}

export default Header;
