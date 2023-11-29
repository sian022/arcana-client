import React, { useRef, useState } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  IconButton,
  Step,
  StepButton,
  StepContent,
  StepIcon,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import {
  Cancel,
  Check,
  CheckCircle,
  Circle,
  Close,
  Delete,
  EventNote,
  HowToReg,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import moment from "moment";
import TertiaryButton from "../TertiaryButton";

function PriceDetailsModal({ ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;

  const [manageMode, setManageMode] = useState(false);

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  return (
    <CommonModal width="740px" {...otherProps} closeTopRight>
      <Box className="priceChangeModal">
        <Typography className="priceChangeModal__title">
          Price Details
        </Typography>

        {/* <Box
          sx={{
            position: "absolute",
            right: "20px",
            top: "20px",
          }}
        >
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box> */}

        <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <Box className="priceChangeModal__currentPrice">
            <Box className="priceChangeModal__currentPrice__left">
              <Box
                sx={{
                  bgcolor: "secondary.main",
                  padding: "10px",
                  borderRadius: "5px",
                  color: "white !important",
                }}
              >
                Current Price
              </Box>
              <Box>
                <TextField
                  size="small"
                  value={selectedRowData?.businessName || "aaaaa"}
                  readOnly
                  sx={{ pointerEvents: "none" }}
                />
              </Box>
            </Box>

            <Box className="priceChangeModal__currentPrice__right">
              <Box
                sx={{
                  bgcolor: "secondary.main",
                  padding: "10px",
                  borderRadius: "5px",
                  color: "white !important",
                }}
              >
                Last Updated
              </Box>
              <Box>
                <TextField
                  size="small"
                  readOnly
                  value={selectedRowData?.clientName || "aaaaa"}
                  sx={{ pointerEvents: "none" }}
                />
              </Box>
            </Box>
          </Box>

          <Box className="priceChangeModal__content">
            <Box className="priceChangeModal__content__left">
              <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <Typography className="priceChangeModal__content__left__title">
                  Future Prices
                </Typography>
                <TertiaryButton
                  sx={{ maxHeight: "25px" }}
                  onClick={() => setManageMode((prev) => !prev)}
                >
                  {manageMode ? "Done" : "Manage"}
                </TertiaryButton>
              </Box>

              <Box className="priceChangeModal__content__left__body">
                <Stepper orientation="vertical">
                  <Step expanded>
                    <StepLabel sx={{ position: "relative" }}>
                      <span style={{ fontWeight: "600" }}>₱ 200</span>
                      {manageMode && (
                        <IconButton
                          sx={{ position: "absolute", right: 0, top: 0 }}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </StepLabel>
                    <StepContent>
                      <Typography fontSize="14px">
                        Effectivity Date:{" "}
                        <span style={{ fontWeight: "500" }}>November 20</span>
                      </Typography>
                    </StepContent>
                  </Step>

                  <Step expanded>
                    <StepLabel sx={{ position: "relative" }}>
                      <span style={{ fontWeight: "600" }}>₱ 200</span>
                      {manageMode && (
                        <IconButton
                          sx={{ position: "absolute", right: 0, top: 0 }}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </StepLabel>
                    <StepContent>
                      <Typography fontSize="14px">
                        Effectivity Date:{" "}
                        <span style={{ fontWeight: "500" }}>November 21</span>
                      </Typography>
                    </StepContent>
                  </Step>

                  <Step expanded>
                    <StepLabel sx={{ position: "relative" }}>
                      <span style={{ fontWeight: "600" }}>₱ 200</span>
                      {manageMode && (
                        <IconButton
                          sx={{ position: "absolute", right: 0, top: 0 }}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </StepLabel>
                    <StepContent>
                      <Typography fontSize="14px">
                        Effectivity Date:{" "}
                        <span style={{ fontWeight: "500" }}>November 22</span>
                      </Typography>
                    </StepContent>
                  </Step>
                </Stepper>
              </Box>
            </Box>
            <Box className="priceChangeModal__content__right">
              <Typography className="priceChangeModal__content__right__title">
                Price History
              </Typography>
              <Box className="priceChangeModal__content__right__body">
                <Stepper
                  orientation="vertical"
                  // activeStep={null}
                >
                  <Step active expanded>
                    <StepLabel
                      StepIconProps={{ icon: "" }}
                      sx={{ position: "relative" }}
                    >
                      <span style={{ fontWeight: "600" }}>₱ 200</span>
                    </StepLabel>
                    <StepContent>
                      <Typography fontSize="14px">
                        Effectivity Date:{" "}
                        <span style={{ fontWeight: "500" }}>November 20</span>
                      </Typography>
                    </StepContent>
                  </Step>

                  <Step active expanded>
                    <StepLabel
                      StepIconProps={{ icon: "" }}
                      sx={{ position: "relative" }}
                    >
                      <span style={{ fontWeight: "600" }}>₱ 200</span>
                    </StepLabel>
                    <StepContent>
                      <Typography fontSize="14px">
                        Effectivity Date:{" "}
                        <span style={{ fontWeight: "500" }}>November 21</span>
                      </Typography>
                    </StepContent>
                  </Step>

                  <Step active expanded>
                    <StepLabel
                      StepIconProps={{ icon: "" }}
                      sx={{ position: "relative" }}
                    >
                      <span style={{ fontWeight: "600" }}>₱ 200</span>
                    </StepLabel>
                    <StepContent>
                      <Typography fontSize="14px">
                        Effectivity Date:{" "}
                        <span style={{ fontWeight: "500" }}>November 22</span>
                      </Typography>
                    </StepContent>
                  </Step>
                </Stepper>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default PriceDetailsModal;
