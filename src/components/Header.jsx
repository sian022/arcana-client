import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { useRef } from "react";
import "../assets/styles/navbar.styles.scss";
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
import moment from "moment";
import { api } from "../features/api";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedStoreType = useSelector(
    (state) => state.selectedStoreType.value
  );

  const fullName = useSelector((state) => state.login.fullname);

  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();

  const {
    isOpen: isChangePasswordOpen,
    onOpen: onChangePasswordOpen,
    onClose: onChangePasswordClose,
  } = useDisclosure();

  const anchorRef = useRef();

  //Constants
  const routesForStoreType = ["/customer-registration/prospect"];

  const handleLogout = () => {
    dispatch(setToken(""));
    dispatch(setFullname(""));
    dispatch(setPermissisons(""));
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("fullname");
    sessionStorage.removeItem("permissions");

    //Reset API state
    dispatch(api.util.resetApiState());

    navigate("/login");
  };

  const handleActions = (action) => {
    if (action === "changePassword") {
      onChangePasswordOpen();
    } else if (action === "logout") {
      // onLogoutOpen();
      handleLogout();
    }

    onMenuClose();
  };

  return (
    <>
      <Box className="navbar">
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <IconButton
            sx={{ color: "secondary.main" }}
            aria-label="toggle sidebar"
            onClick={() => {
              if (window.innerWidth > 1024) {
                dispatch(toggleSidebar());
              } else {
                dispatch(toggleSidebarSmallScreen());
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography className="navbar__dateToday">
            {moment().format("MMMM D, YYYY")}
          </Typography>
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
          {/* <Autocomplete
            options={navigationLabel}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => true}
            disableClearable
            className="navbar__endButtons__quickNavigate"
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
          /> */}
          <Typography>
            {fullName}
            {/* <span style={{ textTransform: "uppercase" }}>{roleName}</span> */}
          </Typography>

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
        {/* <MenuItem
          sx={{
            pointerEvents: "none",
            // maxWidth: "250px",
            width: "220px",
            whiteSpace: "pre-wrap",
            textAlign: "center",
          }}
        >
          {fullName}
        </MenuItem>
        <Divider variant="middle" /> */}

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

      {/* <CommonDialog
        onClose={onLogoutClose}
        open={isLogoutOpen}
        onYes={handleLogout}
      >
        Are you sure you want to{" "}
        <span style={{ fontWeight: "bold" }}>LOGOUT</span>?
      </CommonDialog> */}
    </>
  );
}

export default Header;
