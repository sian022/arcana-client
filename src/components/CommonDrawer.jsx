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
  children,
  ...otherProps
}) {
  return (
    <Drawer anchor="right" {...otherProps}>
      <Box sx={{ display: "flex" }}>
        {navigators && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {navigators.map((item, i) => (
              <Box key={i}>{item}</Box>
            ))}
          </Box>
        )}
        <Box
          className="commonDrawer"
          sx={{ width: width ? `${width} !important` : null }}
        >
          {!noRibbon && !customRibbonContent && (
            <Box className="commonDrawer__ribbon">
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
          >
            {children}
          </Box>
          {!removeButtons && (
            <Box className="commonDrawer__actions">
              <SecondaryButton onClick={onSubmit} disabled={disableSubmit}>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <>{submitLabel || "Submit"}</>
                )}
              </SecondaryButton>
              <DangerButton onClick={onClose}>Close</DangerButton>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}

export default CommonDrawer;
