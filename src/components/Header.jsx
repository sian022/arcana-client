import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import React, { useRef, useState } from "react";
import "../assets/styles/navbar.styles.scss";
import { formatDate } from "../utils/CustomFunctions";
import { navigationData } from "../navigation/navigationData";
import { useLocation, useNavigate } from "react-router-dom";
import { setSelectedStoreType } from "../features/prospect/reducers/selectedStoreTypeSlice";
import {
  AccountCircle,
  KeyboardDoubleArrowLeft,
  Logout,
  Password,
  Menu as MenuIcon,
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
import {
  toggleSidebar,
  toggleSidebarSmallScreen,
} from "../features/misc/reducers/disclosureSlice";

function Header() {
  // const [currentPage, setCurrentPage] = useState(navigationData[0]);
  const [currentPage, setCurrentPage] = useState("");

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
    setCurrentPage(sub);
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

  const handleActions = (action) => {
    if (action === "changePassword") {
      onChangePasswordOpen();
    } else if (action === "logout") {
      onLogoutOpen();
    }

    onMenuClose();
  };

  return (
    <>
      <Box className="navbar">
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <IconButton
            sx={{ color: "secondary.main" }}
            onClick={() => {
              window.innerWidth > 1024
                ? dispatch(toggleSidebar())
                : dispatch(toggleSidebarSmallScreen());
            }}
          >
            <MenuIcon />
          </IconButton>

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

        <Box className="navbar__endButtons">
          {/* <LogoutButton /> */}
          <Autocomplete
            options={navigationLabel}
            getOptionLabel={(option) => option.name}
            disableClearable
            value={currentPage}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Quick Navigate"
                sx={{ width: "300px" }}
                size="small"
              />
            )}
            onChange={handleNavigate}
          />

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
        <MenuItem
          className="actionsMenuItem"
          onClick={() => handleActions("changePassword")}
        >
          <Password />
          Change Password
        </MenuItem>
        <MenuItem
          className="actionsMenuItem"
          onClick={() => handleActions("logout")}
        >
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
