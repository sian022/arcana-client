import { useContext } from "react";
import CommonModal from "../CommonModal";
import { Box, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { AttachmentsContext } from "../../context/AttachmentsContext";
import BlankCanvas from "../../assets/images/blank-canvas.svg";

function ViewPhotoModal({
  currentViewPhotoLabel,
  currentViewPhotoLabelCamel,
  currentViewPhoto,
  cloudified,
  ...otherProps
}) {
  const { onClose } = otherProps;

  const {
    ownersRequirementsIsLink,
    representativeRequirementsIsLink,
    requirementsMode,
  } = useContext(AttachmentsContext);

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
                  requirementsMode === "owner"
                    ? ownersRequirementsIsLink[currentViewPhotoLabelCamel] ||
                      cloudified
                      ? currentViewPhoto
                      : URL.createObjectURL(currentViewPhoto)
                    : representativeRequirementsIsLink[
                        currentViewPhotoLabelCamel
                      ] || cloudified
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
                // src={
                //   cloudified
                //     ? currentViewPhoto
                //     : URL.createObjectURL(currentViewPhoto)
                // }

                src={
                  requirementsMode === "owner"
                    ? ownersRequirementsIsLink[currentViewPhotoLabelCamel] ||
                      cloudified
                      ? currentViewPhoto
                      : currentViewPhoto instanceof File &&
                        URL.createObjectURL(currentViewPhoto)
                    : representativeRequirementsIsLink[
                        currentViewPhotoLabelCamel
                      ] || cloudified
                    ? currentViewPhoto
                    : currentViewPhoto instanceof File &&
                      URL.createObjectURL(currentViewPhoto)
                }
                alt="File preview"
                style={{
                  borderRadius: "12px",
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
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <img src={BlankCanvas} alt="Blank canvas" width="200px" />
          <Typography fontSize="1.1rem" fontWeight="500">
            No photo to display
          </Typography>
        </Box>
      )}
    </CommonModal>
  );
}

export default ViewPhotoModal;
