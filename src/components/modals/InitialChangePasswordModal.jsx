import React, { useState } from "react";
import CommonModal from "../CommonModal";
import SecondaryButton from "../SecondaryButton";
import DangerButton from "../DangerButton";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { initialChangePasswordSchema } from "../../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import useDisclosure from "../../hooks/useDisclosure";
import CommonDialog from "../CommonDialog";
import useSnackbar from "../../hooks/useSnackbar";
import { usePatchChangePasswordMutation } from "../../features/user-management/api/userAccountApi";
import { useDispatch, useSelector } from "react-redux";
import { decryptString } from "../../utils/CustomFunctions";
import {
  setFullname,
  setRoleName,
  setToken,
  setUserDetails,
} from "../../features/authentication/reducers/loginSlice";
import { setPermissisons } from "../../features/authentication/reducers/permissionsSlice";
import { usePatchInitialChangePasswordMutation } from "../../features/authentication/api/loginApi";
import { useNavigate } from "react-router-dom";

function InitialChangePasswordModal({ ...otherProps }) {
  const { onClose, ...noOnClose } = otherProps;

  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [viewNewPassword, setViewNewPassword] = useState(false);
  const [viewConfirmNewPassword, setViewConfirmNewPassword] = useState(false);

  const userDetails = useSelector((state) => state.login.userDetails);
  const username = useSelector((state) => state.login.username);

  //Disclosures
  // const {
  //   isOpen: isConfirmOpen,
  //   onOpen: onConfirmOpen,
  //   onClose: onConfirmClose,
  // } = useDisclosure();

  //RTK Query
  const [patchInitialChangePassword, { isLoading }] =
    usePatchInitialChangePasswordMutation();

  //React Hook Form
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(initialChangePasswordSchema.schema),
    mode: "onChange",
    defaultValues: initialChangePasswordSchema.defaultValues,
  });

  const onSubmit = async (data) => {
    if (data["newPassword"] !== data["confirmNewPassword"]) {
      // onConfirmClose();
      return showSnackbar("Passwords do not match", "error");
    }

    const { newPassword } = data;

    try {
      const decryptedData = decryptString(
        sessionStorage.getItem("userDetails")
      );
      const userId = userDetails.id || decryptedData.id;
      await patchInitialChangePassword({
        id: userId,
        token: userDetails.token,
        oldPassword: userDetails.username,
        newPassword,
      }).unwrap();
      showSnackbar("Password changed successfully", "success");

      dispatch(setUserDetails(userDetails));
      dispatch(setFullname(userDetails.fullname));
      dispatch(setToken(userDetails.token));
      dispatch(setPermissisons(userDetails.permission));
      dispatch(setRoleName(userDetails.roleName));
      navigate("/");

      handleCloseModal();
    } catch (error) {
      console.log(error);
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error changing password", "error");
      }
    }

    // onConfirmClose();
  };

  const handleCloseModal = () => {
    onClose();
    reset();
    setViewNewPassword(false);
    setViewConfirmNewPassword(false);
  };

  return (
    <>
      <CommonModal {...otherProps} width="350px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="changePasswordModal">
            <Box>
              <Typography className="changePasswordModal__title">
                Change User Password
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  mt: "2px",
                  fontSize: "14px",
                  // fontStyle: "italic",
                }}
              >
                Password change required for initial login
              </Typography>
            </Box>

            <Box className="changePasswordModal__form">
              <Box>
                <TextField
                  type={viewNewPassword ? "string" : "password"}
                  size="small"
                  label="Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setViewNewPassword(!viewNewPassword);
                          }}
                          tabIndex={-1}
                        >
                          {viewNewPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register("newPassword")}
                />
              </Box>

              <Box>
                <TextField
                  type={viewConfirmNewPassword ? "string" : "password"}
                  size="small"
                  label="Confirm Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setViewConfirmNewPassword(!viewConfirmNewPassword);
                          }}
                          tabIndex={-1}
                        >
                          {viewConfirmNewPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register("confirmNewPassword")}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: "10px",
              marginTop: "20px",
            }}
            className="roleTaggingModal__actions"
          >
            <DangerButton onClick={handleCloseModal}>Close</DangerButton>

            <SecondaryButton
              // onClick={onConfirmOpen}
              // onClick={handleSubmit(onSubmit)}
              type="submit"
              disabled={!watch("newPassword") || !watch("confirmNewPassword")}
            >
              {isLoading ? <CircularProgress size="20px" /> : "Save"}
            </SecondaryButton>
          </Box>
        </form>
      </CommonModal>

      {/* <CommonDialog
        onClose={onConfirmClose}
        open={isConfirmOpen}
        onYes={handleSubmit(onSubmit)}
        noIcon
        isLoading={isLoading}
      >
        Are you sure you want to change password?
      </CommonDialog> */}
    </>
  );
}

export default InitialChangePasswordModal;
