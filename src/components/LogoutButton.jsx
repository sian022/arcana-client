import { Logout } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import {
  setFullname,
  setToken,
} from "../features/authentication/reducers/loginSlice";
import { setPermissisons } from "../features/authentication/reducers/permissionsSlice";
import { useNavigate } from "react-router-dom";
import CommonDialog from "./CommonDialog";
import useDisclosure from "../hooks/useDisclosure";

function LogoutButton() {
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      <IconButton onClick={onDialogOpen} sx={{ color: "error.main" }}>
        <Logout />
      </IconButton>

      <CommonDialog
        onClose={onDialogClose}
        open={isDialogOpen}
        onYes={handleLogout}
      >
        Are you sure you want to{" "}
        <span style={{ fontWeight: "bold" }}>LOGOUT</span>?
      </CommonDialog>
    </>
  );
}

export default LogoutButton;
