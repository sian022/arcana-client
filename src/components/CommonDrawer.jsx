import { Close } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import SuccessButton from "./SuccessButton";

function CommonDrawer({
  onClose,
  drawerHeader,
  onSubmit,
  disableSubmit,
  isLoading,
  width,
  navigators,
  removeButtons,
  noRibbon,
  submitLabel,
  customRibbonContent,
  paddingSmall,
  zIndex,
  children,
  className,
  responsiveBreakpoint,
  enableAutoAnimate,
  smallMarginTop,
  ...otherProps
}) {
  const [parent] = useAutoAnimate();

  return (
    <Drawer anchor="right" sx={{ zIndex: zIndex && zIndex }} {...otherProps}>
      <Box sx={{ display: "flex", flex: 1 }} className={className}>
        {navigators && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {navigators.map((item, i) => (
              <Box key={i}>{item}</Box>
            ))}
          </Box>
        )}
        <Box
          className="commonDrawer"
          sx={{
            width: width ? `${width} !important` : null,
            [`@media (max-width: ${responsiveBreakpoint})`]: {
              width: responsiveBreakpoint && "100% !important",
            },
          }}
        >
          {!noRibbon && !customRibbonContent && (
            <Box
              className="commonDrawer__ribbon"
              sx={{ mt: smallMarginTop && "5px" }}
            >
              <Typography className="commonDrawer__ribbon__title">
                {drawerHeader}
              </Typography>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
          )}

          {!noRibbon && customRibbonContent && (
            <Box className="commonDrawer__ribbonCustom">
              {customRibbonContent}
            </Box>
          )}
          <Box
            className={
              paddingSmall ? "commonDrawer__bodyCompact" : "commonDrawer__body"
            }
            ref={enableAutoAnimate ? parent : null}
          >
            {children}
          </Box>
          {!removeButtons && (
            <Box className="commonDrawer__actions">
              <DangerButton onClick={onClose} disabled={isLoading}>
                Close
              </DangerButton>

              <SuccessButton
                onClick={onSubmit}
                disabled={disableSubmit || isLoading}
              >
                {isLoading ? (
                  <CircularProgress size="20px" />
                ) : (
                  <>{submitLabel || "Submit"}</>
                )}
              </SuccessButton>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}

export default CommonDrawer;
