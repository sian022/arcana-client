import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Autocomplete,
  TextField,
  Divider,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
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
import { registrationApi } from "../features/registration/api/registrationApi";
import { listingFeeApi } from "../features/listing-fee/api/listingFeeApi";
import { prospectApi } from "../features/prospect/api/prospectApi";
import { notificationApi } from "../features/notification/api/notificationApi";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const permissions = useSelector((state) => state.permissions?.permissions);
  const permittedRoutes = navigationData.filter((item) =>
    permissions?.includes(item.name)
  );

  const navigationLabel = [
    navigationData[0],
    ...permittedRoutes.reduce((accumulator, item) => {
      if (item.sub) {
        accumulator.push(...item.sub);
      }
      return accumulator;
    }, []),
  ];

  // const initialPage =
  //   location.pathname === "/"
  //     ? navigationData[0]
  //     : navigationLabel?.find((item) => location.pathname?.includes(item.path));

  const initialPage = navigationLabel?.find((item) =>
    location.pathname?.includes(item.path)
  );

  const [currentPage, setCurrentPage] = useState(initialPage);

  const selectedStoreType = useSelector(
    (state) => state.selectedStoreType.value
  );

  const fullName = useSelector((state) => state.login.fullname);
  const roleName = useSelector((state) => state.login.roleName);

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

  const handleNavigate = (_, sub) => {
    setCurrentPage(sub);
    navigate(sub.path);
  };

  const handleLogout = () => {
    dispatch(notificationApi.util.resetApiState());

    dispatch(setToken(""));
    dispatch(setFullname(""));
    dispatch(setPermissisons(""));
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("fullname");
    sessionStorage.removeItem("permissions");

    dispatch(registrationApi.util.resetApiState());
    dispatch(listingFeeApi.util.resetApiState());
    dispatch(prospectApi.util.resetApiState());

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

  useEffect(() => {
    // if (location.pathname !== "/" || location.pathname !== "") {
    const foundItem = navigationLabel?.find(
      (item) =>
        // location.pathname?.includes(item.path)
        location.pathname === item.path
    );
    setCurrentPage(foundItem);
    // }
  }, [location.pathname]);

  // console.log(currentPage);
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
            {fullName} - {roleName}
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
