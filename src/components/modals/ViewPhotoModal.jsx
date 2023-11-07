import React from "react";
import CommonModal from "../CommonModal";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

function ViewPhotoModal({
  currentViewPhotoLabel,
  currentViewPhoto,
  cloudified,
  ...otherProps
}) {
  const { onClose, ...noOnClose } = otherProps;

  return (
    <CommonModal width="800px" {...otherProps}>
      <Box className="attachments__viewModal__title">
        <Typography>
          {currentViewPhotoLabel ? currentViewPhotoLabel : "Photo Preview"}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {currentViewPhoto ? (
        <>
          {currentViewPhotoLabel === "Signature" ? (
            <Box className="attachments__viewModal__signature">
              <img
                src={
                  cloudified
                    ? currentViewPhoto
                    : URL.createObjectURL(currentViewPhoto)
                }
                alt="File preview"
                style={{ borderRadius: "12px" }}
              />
            </Box>
          ) : currentViewPhotoLabel !== "Signature" &&
            currentViewPhotoLabel !== null ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "800px",
                height: "500px",
              }}
            >
              <img
                src={
                  cloudified
                    ? currentViewPhoto
                    : URL.createObjectURL(currentViewPhoto)
                }
                alt="File preview"
                style={{
                  borderRadius: "12px",
                  // width: "800px",
                  // height: "auto",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </Box>
          ) : null}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </CommonModal>
  );
}

export default ViewPhotoModal;
