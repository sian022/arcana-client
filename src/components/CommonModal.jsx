import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";

function CommonModal({
  customRibbonContent,
  disablePadding,
  paddingCustom,
  width,
  flex,
  overflow,
  ribbon,
  ribbonPadding,
  children,
  height,
  maxHeight,
  closeTopRight,
  customOnClose,
  disableCloseTopRight,
  ...otherProps
}) {
  const { onClose, ...noOnCloseProps } = otherProps;

  return (
    <Modal {...noOnCloseProps}>
      <Box
        sx={{
          width: width ? width : "500px",
          padding: disablePadding
            ? "0 !important"
            : paddingCustom
            ? paddingCustom
            : "30px",
          height: height && height,
          maxHeight: maxHeight && maxHeight,
          overflow: overflow && overflow,
          flex: flex && flex,
        }}
        className="commonModal"
      >
        {closeTopRight && (
          <Box
            // sx={{ display: "flex", justifyContent: "end" }}
            sx={{
              position: "absolute",
              right: "20px",
              top: "20px",
            }}
          >
            <IconButton
              onClick={customOnClose ? customOnClose : onClose}
              disabled={disableCloseTopRight}
              data-testid="common-modal-close-button"
            >
              <Close />
            </IconButton>
          </Box>
        )}
        {ribbon && (
          <Box
            className="commonModal__ribbon"
            sx={{ padding: ribbonPadding && ribbonPadding }}
          >
            {customRibbonContent && customRibbonContent}
          </Box>
        )}
        {children}
      </Box>
    </Modal>
  );
}

export default CommonModal;
