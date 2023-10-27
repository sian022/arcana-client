import React, { useState } from "react";
import CommonModal from "../CommonModal";
import SecondaryButton from "../SecondaryButton";
import DangerButton from "../DangerButton";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { changePasswordSchema } from "../../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import useDisclosure from "../../hooks/useDisclosure";
import CommonDialog from "../CommonDialog";

function ChangePasswordModal({ ...otherProps }) {
  const { onClose, ...noOnClose } = otherProps;

  const [viewOldPassword, setViewOldPassword] = useState(false);
  const [viewNewPassword, setViewNewPassword] = useState(false);
  const [viewConfirmNewPassword, setViewConfirmNewPassword] = useState(false);

  //Disclosures
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(changePasswordSchema.schema),
    mode: "onChange",
    defaultValues: changePasswordSchema.defaultValues,
  });

  const onSubmit = (data) => {
    onConfirmClose();
    onClose();
    reset();
  };

  return (
    <>
      <CommonModal {...otherProps} width="350px">
        <Box className="changePasswordModal">
          <Typography className="changePasswordModal__title">
            Change User Password
          </Typography>
          <Box className="changePasswordModal__form">
            <Box>
              <TextField
                type={viewOldPassword ? "string" : "password"}
                size="small"
                label="Old Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setViewOldPassword(!viewOldPassword);
                        }}
                      >
                        {viewOldPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register("oldPassword")}
              />
            </Box>

            <Box>
              <TextField
                type={viewNewPassword ? "string" : "password"}
                size="small"
                label="New Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setViewNewPassword(!viewNewPassword);
                        }}
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
                label="Confirm New Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setViewConfirmNewPassword(!viewConfirmNewPassword);
                        }}
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
          <SecondaryButton onClick={onConfirmOpen} disabled={!isValid}>
            Save
          </SecondaryButton>
          <DangerButton onClick={onClose}>Close</DangerButton>
        </Box>
      </CommonModal>

      <CommonDialog
        onClose={onConfirmClose}
        open={isConfirmOpen}
        onYes={handleSubmit(onSubmit)}
        noIcon
      >
        Are you sure you want to change password?
      </CommonDialog>
    </>
  );
}

export default ChangePasswordModal;
